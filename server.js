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
            nivel_actual: usuario.nivel_actual
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Iniciar servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de SUMARIS corriendo en http://localhost:${PORT}`);
});