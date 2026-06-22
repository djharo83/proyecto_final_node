const router = require('express').Router();
const { startOrGetConversation, getMyConversations } = require('../../controllers/conversations.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

// Ver todos mis chats
router.get('/', checkToken, getMyConversations);

// Iniciar o recuperar chat de un artículo
router.post('/', checkToken, startOrGetConversation);

module.exports = router;