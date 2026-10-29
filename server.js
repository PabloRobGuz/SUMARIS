const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la conexión a la Base de Datos MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',          
    password: 'PassL0Lj3j3@',
    database: 'sumaris'
};

// ==========================================
// RUTA DE REGISTRO (CON TRANSACCIÓN)
// ==========================================
app.post('/api/registro', async (req, res) => {
    const { nombre_usuario, correo, contrasena, edad } = req.body;

    // Validación básica
    if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        // INICIO DE LA TRANSACCIÓN
        await connection.beginTransaction();

        // 1. Cifrar la contraseña por seguridad (Hashing)
        const saltRounds = 10;
        const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

        // 2. Insertar el usuario en la tabla
        const [resultadoUsuario] = await connection.execute(
            `INSERT INTO usuario (nombre_usuario, correo_electronico, contrasena_hash, edad, nivel_actual, estereotipo) 
             VALUES (?, ?, ?, ?, 'Principiante', 'Explorador Novato')`,
            [nombre_usuario || correo.split('@')[0], correo, contrasena_hash, edad || 10]
        );

        const id_usuario = resultadoUsuario.insertId;

        // Nota: El Trigger que creamos en la base de datos se ejecutará 
        // automáticamente aquí para asignarle su primer nodo de progreso.

        // CONFIRMAR TRANSACCIÓN (COMMIT)
        await connection.commit();
        await connection.end();

        res.status(201).json({ mensaje: '¡Usuario registrado con éxito!', id_usuario });

    } catch (error) {
        // SI OCURRE UN ERROR, REVERTIR TODO (ROLLBACK)
        await connection.rollback();
        await connection.end();

        console.error('Error en transacción de registro:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar.' });
    }
});

// ==========================================
// RUTA DE INICIO DE SESIÓN (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Ingresa tu correo y contraseña.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Buscar al usuario por correo
        const [rows] = await connection.execute(
            'SELECT * FROM usuario WHERE correo_electronico = ?',
            [correo]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }

        const usuario = rows[0];

        // Validar la contraseña cifrada
        const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena_hash);

        if (!passwordMatch) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }

        // Login exitoso
        res.json({
            mensaje: '¡Bienvenido!',
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            nivel_actual: usuario.nivel_actual,
            test_completado: usuario.test_completado
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// ==========================================
// RUTA PARA GUARDAR EL RESULTADO DEL TEST
// ==========================================
app.post('/api/completar-test', async (req, res) => {
    const { id_usuario, puntos } = req.body;

    if (id_usuario === undefined || puntos === undefined) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios para el coldstart.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Lógica del Motor Adaptativo para definir nivel y estereotipo según el puntaje (0 a 6 aciertos)
        let nivel = 'Principiante';
        let estereotipo = 'Explorador Novato';

        if (puntos === 0) {
            nivel = 'Principiante';
            estereotipo = 'Aprendiz Frágil';
        } else if (puntos >= 1 && puntos <= 2) {
            nivel = 'Principiante';
            estereotipo = 'Explorador Novato';
        } else if (puntos >= 3 && puntos <= 4) {
            nivel = 'Intermedio';
            estereotipo = 'Autodidacta Constante';
        } else if (puntos >= 5) {
            nivel = 'Avanzado';
            estereotipo = 'Autodidacta Eficiente';
        }

        // 2. Actualizar el perfil del usuario con los resultados del coldstart
        await connection.execute(
            `UPDATE usuario 
             SET nivel_actual = ?, estereotipo = ?, test_completado = TRUE 
             WHERE id_usuario = ?`,
            [nivel, estereotipo, id_usuario]
        );

        await connection.end();

        res.json({ 
            mensaje: 'Coldstart procesado con éxito', 
            nivel_asignado: nivel, 
            estereotipo_asignado: estereotipo 
        });

    } catch (error) {
        console.error('Error al procesar el coldstart:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al procesar el test de diagnóstico.' });
    }
});

// ==============================================
// RUTA PARA REGISTRAR INTENTO Y ANALIZAR APOYO
// ==============================================
app.post('/api/registrar-intento', async (req, res) =>{
    const { id_usuario, id_nodo, es_correcto, tiempo_respuesta } =req.body;

    if (id_usuario === undefined || id_nodo === undefined || es_correcto === undefined) {
        return res.status(400).json({mensaje: 'Faltan datos obligatorios para regisrar intento.'});
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        //1. Guardar el intento en la tabla de historial (intento_ejercicio)
        await connection.execute(
            'INSERT INTO intento_ejercicio (id_usuario, id_nodo, es_correcto, tiempo_respuesta, fecha_intento) VALUES (?, ?, ?, ?, NOW())',
            [id_usuario, id_nodo, es_correcto, tiempo_respuesta || 0]
        );

        // 2. Analizar el rendimiento reciente del usuario para decidir si necesita apoyo
        const [rows] = await connection.execute(
            `SELECT es_correcto FROM intento_ejercicio 
            WHERE id_usuario = ? AND id_nodo = ? 
            ORDER BY fecha_intento DESC LIMIT 3`,
            [id_usuario, id_nodo]
        );

        // Nos aseguramos de que sea un arreglo válido de filas (evita cualquier tipo de error)
        const ultimosIntentos = Array.isArray(rows) ? rows : [];

        let requiereApoyo = false;
        let accionSugerida = "avanzar";

        if (!es_correcto) {
            // Contar cuántos errores consecutivos lleva
            const erroresConsecutivos = ultimosIntentos.filter(intento => !intento.es_correcto).length;

            if (erroresConsecutivos >= 2) {
                requiereApoyo = true;
                accionSugerida = "activar_pista_o_rescate";
            } else {
                accionSugerida = "reintentar";
            }
        }

        await connection.end();

        res.json({
            mensaje: "Intento registrado correctamente", es_correcto,
            requiere_apoyo: requiereApoyo,
            accion_sugerida: accionSugerida
        });
    } catch (error) {
        console.error('Error al registrar el intento:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar el intento'});
    }
});

// Iniciar servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de SUMARIS corriendo en http://localhost:${PORT}`);
});