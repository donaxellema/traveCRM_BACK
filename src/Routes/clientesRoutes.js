const express = require('express');
const clientes  = require('../Controladores/clientes/clientesController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const router = express.Router();

//router.get('/agentes_id', authenticate, agentes.getByID_agentesCRUD);/*Suspendida hasta nuevo aviso*/

router.post('/clientes_delete', authenticate, clientes.clienteCRUD);
router.get('/clientes_verifica', authenticate, clientes.clientes_verifica);
router.post('/clientes', authenticate, clientes.clienteCRUD);
router.put('/clientes', authenticate, clientes.clienteCRUD);
router.get('/clientes_by_id', authenticate, clientes.getClientesCRUD);
router.get('/clientes_search', authenticate, clientes.get_ClientesSearchCRUD);
router.get('/clientes', authenticate, clientes.getClientesCRUD);
module.exports = router;

