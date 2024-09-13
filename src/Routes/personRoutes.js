const express = require('express');
const personas  = require('../Controladores/personas/personController');
const authenticate = require('../Middleware/authentication');
const router = express.Router();

router.post('/personas', authenticate, personas.personCRUD);
router.get('/personas', authenticate, personas.get_personasCRUD);
router.get('/personasSearch', authenticate, personas.get_personasCRUD);
router.put('/personas', authenticate, personas.personCRUD);
router.post('/personasDelete', authenticate, personas.personCRUD);//



module.exports = router;

