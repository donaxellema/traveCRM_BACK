const express = require('express');
const askChatGPT  = require("../Controladores/botAsigna/chatController");
const authenticate = require('../Middleware/authentication');
const router = express.Router();


router.post("/bot_ia", askChatGPT.askChatGPT);

module.exports = router;
