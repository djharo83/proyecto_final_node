const router = require('express').Router();
const { getByConversationId } = require('../../controllers/messages.controller');
const { checkToken } = require('../../middlewares/auth.middleware');


router.get('/:conversationId', checkToken, getByConversationId);

module.exports = router;