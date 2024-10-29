const express = require('express');
const clientes  = require('../Controladores/clientes/clientesController');
const dashboard  = require('../Controladores/dashboard/dashboardController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const router = express.Router();

//router.get('/agentes_id', authenticate, agentes.getByID_agentesCRUD);/*Suspendida hasta nuevo aviso*/

router.get('/clientes_by_agentes', authenticate, dashboard.getClientesByAgentes);
router.get('/clientes_by_provincia', authenticate, dashboard.getClientesByProvincia);

module.exports = router;

