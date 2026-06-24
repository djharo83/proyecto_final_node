const db = require('../config/db');

// Buscar si ya existe una conversación para un artículo y un comprador
const getByArticleAndBuyer = async (articleId, buyerId) => {
    const [result] = await db.query(
        'SELECT * FROM conversations WHERE article_id = ? AND buyer_id = ?', 
        [articleId, buyerId]
    );
    return result[0];
};

// Crear una nueva conversación
const insert = async ({ article_id, buyer_id, seller_id }) => {
    const [result] = await db.query(
        'INSERT INTO conversations (article_id, buyer_id, seller_id) VALUES (?, ?, ?)',
        [article_id, buyer_id, seller_id]
    );
    return result.insertId;
};

// Obtener la bandeja de entrada (inbox) de un usuario
const getByUserId = async (userId) => {
    const [result] = await db.query(
        `SELECT c.id as conversation_id, c.article_id, c.buyer_id, c.seller_id, c.created_at,
                a.title as article_title, a.price as article_price,
                u_buyer.username as buyer_name, u_seller.username as seller_name
         FROM conversations c
         JOIN articles a ON c.article_id = a.id
         JOIN users u_buyer ON c.buyer_id = u_buyer.id
         JOIN users u_seller ON c.seller_id = u_seller.id
         WHERE c.buyer_id = ? OR c.seller_id = ?
         ORDER BY c.created_at DESC`,
        [userId, userId]
    );
    return result;
};

module.exports = { getByArticleAndBuyer, insert, getByUserId };