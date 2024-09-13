const express = require('express');
const router = express.Router();
const whatsappController = require('./../Controladores/whatsappChromiun/whatsappController_web');
//const getContactosWhatsapp = require('./../Controladores/whatsappChromiun/listaContactosController');
//controllers/whatsappController

// Ruta para enviar un mensaje
router.post('/send-message', whatsappController.sendMessage);
//router.post('/logout-whatsapp', whatsappController.logout);

router.get('/get-contactos', whatsappController.getContacts);

module.exports = router;