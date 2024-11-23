const express = require('express');
//const agentes  = require('../Controladores/agentes/agentesController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const campamasivas  = require('../Controladores/campañasMasivas/campMasivaController');

const router = express.Router();


router.post('/uploadcontac', authenticate, campamasivas.uploadFile);

module.exports = router;