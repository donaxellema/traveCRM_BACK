const express = require('express');
const empresas  = require('../Controladores/empresas/empresasController');
const authenticate = require('../Middleware/authentication');
const router = express.Router();

router.post('/empresas',authenticate, empresas.empresasCRUD);
router.get('/empresas',authenticate, empresas.getEmpresasCRUD);
router.put('/empresas',authenticate, empresas.empresasCRUD);

module.exports = router;