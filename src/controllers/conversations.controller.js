const ConversationsModel = require('../models/conversations.model');
const ArticlesModel = require('../models/articles.model');

// Acción al pulsar "Contactar" en un artículo
const startOrGetConversation = async (req, res) => {
    try {
        const { article_id } = req.body;
        const buyer_id = req.user.id; // El que le da al botón de contactar es el comprador (logueado)

        // 1. Obtener el artículo para saber quién es el vendedor
        const article = await ArticlesModel.getById(article_id);
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        const seller_id = article.user_id;

        // 2. Validar que no intentes comprarte tu propio artículo
        if (buyer_id === seller_id) {
            return res.status(400).json({ message: 'No puedes iniciar un chat contigo mismo' });
        }

        // 3. Comprobar si ya hablaron antes sobre este artículo
        let conversation = await ConversationsModel.getByArticleAndBuyer(article_id, buyer_id);

        // 4. Si no hay conversación previa, la creamos en MySQL
        if (!conversation) {
            const insertId = await ConversationsModel.insert({ article_id, buyer_id, seller_id });
            conversation = { id: insertId, article_id, buyer_id, seller_id };
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Acción para ver "Mis Mensajes"
const getMyConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await ConversationsModel.getByUserId(userId);
        
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { startOrGetConversation, getMyConversations };