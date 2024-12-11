// src/Database/firebase.js
const admin = require('firebase-admin');
require('dotenv').config();  // Para cargar variables de entorno

const path = require('path');  // Para manejar rutas de manera más flexible

// Utiliza path.resolve para obtener una ruta absoluta
//const serviceAccount = require(path.resolve(__dirname, '../../src/Middleware/chatcrm-17e65-firebase-adminsdk-29q4z-c767c8815f.json'));
const serviceAccount = require(path.resolve(__dirname, '../../src/Middleware/chatcrm-17e65-firebase-adminsdk-29q4z-edd1a0e6e0.json'));

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
//module.exports = { db };
