const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const motor = require('./motor-adaptativo');
const motorDb = require('./motor-db');

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
    const { id_usuario, id_nodo, es_correcto, tiempo_respuesta, pistas_solicitadas } =req.body;

    if (id_usuario === undefined || id_nodo === undefined || es_correcto === undefined) {
        return res.status(400).json({mensaje: 'Faltan datos obligatorios para regisrar intento.'});
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        //1. Guardar el intento en la tabla de historial (intento_ejercicio)
        await connection.execute(
            'INSERT INTO intento_ejercicio (id_usuario, id_nodo, es_correcto, tiempo_respuesta, pistas_solicitadas, fecha_intento) VALUES (?, ?, ?, ?, ?, NOW())',
            [id_usuario, id_nodo, es_correcto, tiempo_respuesta || 0, pistas_solicitadas || 0]
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

// ==============================================================
// MOTOR ADAPTATIVO: EVALUAR UNA SESIÓN Y RECOMENDAR LA RUTA
// ==============================================================
// Cuerpo esperado (se aceptan también los nombres usuario_id / nodo_id / pistas_usadas):
// { id_usuario, id_nodo, aciertos, errores, tiempo_invertido_segundos, pistas_solicitadas, completada?, origen? }
app.post('/api/evaluar-sesion', async (req, res) => {
    const entrada = motor.normalizarIntento(req.body);
    if (!entrada.ok) {
        return res.status(400).json({ mensaje: entrada.error });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const resultado = await motorDb.evaluarSesion(connection, entrada.valor);
        res.json({ mensaje: 'Sesión evaluada correctamente', ...resultado });
    } catch (error) {
        manejarErrorMotor(error, res, 'evaluar la sesión');
    } finally {
        if (connection) await connection.end().catch(() => {});
    }
});

// ==============================================================
// MOTOR ADAPTATIVO: ESTADO DEL GRAFO DE UN ESTUDIANTE
// ==============================================================
app.get('/api/ruta/:id_usuario', async (req, res) => {
    const idUsuario = Number(req.params.id_usuario);
    if (!Number.isInteger(idUsuario) || idUsuario < 1) {
        return res.status(400).json({ mensaje: 'Usuario inválido.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const ruta = await motorDb.obtenerRuta(connection, idUsuario);
        res.json({ id_usuario: idUsuario, ...ruta });
    } catch (error) {
        manejarErrorMotor(error, res, 'consultar la ruta de aprendizaje');
    } finally {
        if (connection) await connection.end().catch(() => {});
    }
});

function manejarErrorMotor(error, res, accion) {
    if (error.estadoHttp) {
        return res.status(error.estadoHttp).json({ mensaje: error.message });
    }
    if (error.code === 'ER_NO_SUCH_TABLE') {
        console.error('Faltan las tablas del motor adaptativo. Ejecuta motor_adaptativo.sql.', error.message);
        return res.status(503).json({ mensaje: 'El motor adaptativo no está instalado en la base de datos (falta ejecutar motor_adaptativo.sql).' });
    }
    console.error(`Error al ${accion}:`, error);
    res.status(500).json({ mensaje: `Error interno del servidor al ${accion}.` });
}

// Iniciar servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Servidor de SUMARIS corriendo en http://localhost:${PORT}`);

    // Comprobación del grafo de conocimiento (no detiene el servidor si algo falla)
    try {
        const connection = await mysql.createConnection(dbConfig);
        const revision = await motorDb.verificarGrafo(connection);
        await connection.end();
        if (revision.valido) console.log('Motor adaptativo: grafo de conocimiento válido.');
        else console.warn('Motor adaptativo: problemas en el grafo ->', revision.problemas.join(' | '));
    } catch (error) {
        console.warn('Motor adaptativo: no se pudo verificar el grafo (¿ejecutaste motor_adaptativo.sql?).', error.code || error.message);
    }
});