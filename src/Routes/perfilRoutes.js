const express = require('express');
const perfil  = require('../Controladores/perfil/perfilController');
const authenticate = require('../Middleware/authentication');
//const { agentesCRUD } = require('../Controladores/agentes/agentesController');
const router = express.Router();

//router.get('/agentes_id', authenticate, agentes.getByID_agentesCRUD);/*Suspendida hasta nuevo aviso*/

router.post('/perfil_delete', authenticate, perfil.delete_perfilCRUD);
router.post('/perfil', authenticate, perfil.perfilCRUD);
router.put('/perfil', authenticate, perfil.perfilCRUD);
router.get('/perfil_by_id', authenticate, perfil.getPerfilCRUD);
router.get('/perfil_search', authenticate, perfil.get_PerfilSearchCRUD);
router.get('/perfil', authenticate, perfil.getPerfilCRUD);
router.post('/perfil_pass', authenticate, perfil.cambiaPassword);
router.post('/perfil_ima', authenticate, perfil.perfilCRUD);
module.exports = router;

