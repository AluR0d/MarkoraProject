import express from 'express';
import { sequelize } from './config/database';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Role } from './models/Role';

dotenv.config();
const app = express();
const port = process.env.PORT || 5432;

// Middleware básico
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Markora backend funcionando!');
});

// Conectar a DB y lanzar servidor
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

start();
