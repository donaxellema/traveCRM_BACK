// routes/userRoutes.js
const express = require('express');
//const { createUser } = require('../Controladores/fbase_mensajes/userController');
//const { addMessage,addUser } = require('../Controladores/fbase_mensajes/mensajes/messagesController');
const { addPerson,getPersons } = require('../Controladores/fbase_mensajes/personas/personasController');
const { addUser,getUsers } = require('../Controladores/fbase_mensajes/usuarios/usuariosController');
const { addChat,getChats } = require('../Controladores/fbase_mensajes/chat/chatController');

const router = express.Router();

// Definir la ruta para crear un usuario
router.post('/create_persona', addPerson);
router.post('/create_usuario', addUser);
router.post('/create_chat', addChat);

router.post('/create_user', addUser);
//router.post('/create_messages',addMessage );

module.exports = router;
