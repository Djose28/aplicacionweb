const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'miaplicacion',
  password: 'admin',
  port: 5432,
});

// Inicialización de Express
const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON
const PORT = 3001;

// Probar la conexión a PostgreSQL
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0].now);
  }
});

// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insertar el nuevo usuario en la base de datos
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    // Responder con un mensaje de éxito
    res.status(201).json({ message: 'Usuario registrado.' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(400).json({ message: err.message });
  }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);

    // Si el usuario existe, comparar las contraseñas
    if (result.rows.length > 0) {
      const isMatch = await bcrypt.compare(password, result.rows[0].password);
      if (isMatch) {
        // Generar un token JWT
        const token = jwt.sign({ id: username }, 'secreto', { expiresIn: '2h' });
        res.json({ token });
      } else {
        res.status(400).json({ message: 'Contraseña incorrecta.' });
      }
    } else {
      res.status(400).json({ message: 'Usuario no encontrado.' });
    }
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    res.status(400).json({ message: err.message });
  }
});

// Endpoint básico para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor Backend Corriendo');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
