const MessagesModel = require('../models/messages.model');

const getByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await MessagesModel.getByConversationId(conversationId);
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getByConversationId };