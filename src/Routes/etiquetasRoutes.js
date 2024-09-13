const express = require('express');
const etiquetas  = require('../Controladores/etiquetas/etiquetasController');
const authenticate = require('../Middleware/authentication');
const router = express.Router();

router.post('/etiquetas', authenticate, etiquetas.etiquetasCRUD);
router.get('/etiquetas', authenticate, etiquetas.get_etiquetasCRUD);
router.get('/etiquetas/id', authenticate, etiquetas.getByID_etiquetasCRUD);/*Suspendida hasta nuevo aviso*/
router.get('/etiquetasSearch', authenticate, etiquetas.get_etiquetasCRUD);
router.put('/etiquetas', authenticate, etiquetas.etiquetasCRUD);
router.delete('/etiquetas', authenticate, etiquetas.delete_etiquetasCRUD);

module.exports = router;


