const express = require('express');
const { login } = require('../Controladores/auth/authController');
const { logout } = require('../Controladores/auth/authController');
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;