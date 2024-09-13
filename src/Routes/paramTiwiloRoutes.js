const express = require('express');
const parametros  = require('../Controladores/parametros/paramsTiwiloController');
const authenticate = require('../Middleware/authentication');
const router = express.Router();

router.post('/parametrosTiwilo',authenticate, parametros.registerParamTiwilo);
router.get('/parametrosTiwilo', authenticate, parametros.getParamTiwilo);
router.put('/parametrosTiwilo', authenticate, parametros.CRUD_ParamTiwilo);

module.exports = router;