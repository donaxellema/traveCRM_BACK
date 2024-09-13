const express = require('express');
const parametrosTime  = require('../Controladores/parametros/paramsTiemposController');
const authenticate = require('../Middleware/authentication');
const router = express.Router();

router.post('/parametrosTiempos',authenticate, parametrosTime.paramsTiempos);

module.exports = router;