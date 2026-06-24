const db = require('../config/db');

// Obtener el historial de una conversación
const getByConversationId = async (conversationId) => {
    const [result] = await db.query(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC',
        [conversationId]
    );
    return result;
};

// Guardar un nuevo mensaje
const insert = async ({ conversation_id, sender_id, content }) => {
    const [result] = await db.query(
        'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
        [conversation_id, sender_id, content]
    );
    return result.insertId;
};

// Buscar un mensaje por ID para devolverlo completo tras insertarlo
const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM messages WHERE id = ?', [id]);
    return result[0];
};

module.exports = { getByConversationId, insert, getById };