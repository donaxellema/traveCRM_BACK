const express = require('express');
const clientes  = require('../Controladores/clientes/clientesController');
const campanias  = require('../Controladores/campanias/campaniasController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const router = express.Router();

//router.get('/agentes_id', authenticate, agentes.getByID_agentesCRUD);/*Suspendida hasta nuevo aviso*/

router.post('/campanias_delete', authenticate, campanias.campaniasCRUD);
router.get('/campanias_verifica', authenticate, campanias.campanias_verifica);
router.post('/campanias', authenticate, campanias.campaniasCRUD);
router.put('/campanias', authenticate, campanias.campaniasCRUD);
router.get('/campanias_by_id', authenticate, campanias.getCampaniasCRUD);
router.get('/campanias_search', authenticate, campanias.get_CampaniasSearchCRUD);
router.get('/campanias', authenticate, campanias.getCampaniasCRUD);
router.post('/campanias_send_users', authenticate, campanias.campaniasCRUD_by_users);
module.exports = router;

