const express = require('express');
const multer = require('multer');
const path = require('path');

const authenticate = require('../Middleware/authentication');
const router = express.Router();
const fs = require('fs');


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log(JSON.stringify(file))
      //cb(null, Date.now() + path.extname(file.originalname)); // agregar timestamp al nombre del archivo
      cb(null, file.originalname); // agregar timestamp al nombre del archivo
    },

  });
  
  const upload = multer({ storage });





router.post('/upload',authenticate ,upload.single('image'), (req, res) => {
    try {
      res.status(200).json({
        message: 'Imagen subida exitosamente',
        filename: req.file.filename,
        path: req.file.path,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error subiendo la imagen' });
    }
});


module.exports = router;