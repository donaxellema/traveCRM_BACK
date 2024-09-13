const express = require('express');
const agentes  = require('../Controladores/agentes/agentesController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const router = express.Router();

//router.get('/agentes_id', authenticate, agentes.getByID_agentesCRUD);/*Suspendida hasta nuevo aviso*/

router.post('/agentes_delete', authenticate, agentes.agentesCRUD);
router.get('/agentes_verifica', authenticate, agentes.agentes_verifica);
router.post('/agentes', authenticate, agentes.agentesCRUD);
router.put('/agentes', authenticate, agentes.agentesCRUD);
router.get('/agentes_by_id', authenticate, agentes.getAgentesCRUD);
router.get('/agentes_search', authenticate, agentes.get_agentesSearchCRUD);
router.get('/agentes', authenticate, agentes.getAgentesCRUD);


router.get('/agentes_on_line', authenticate, agentes.getAgentesCRUD);


module.exports = router;

