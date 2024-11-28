const express = require('express');
const router = express.Router();

// Importa multer
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {uploadContacts}  = require('../Controladores/campañasMasivas/campMasivaController');



//router.post('/uploadcontac', authenticate, campamasivas.uploadFile);



router.post('/upload-contacts', upload.single('file'), uploadContacts);



module.exports = router;