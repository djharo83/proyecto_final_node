const db = require('../config/db');

// Obtener TODOS los artículos con su foto principal
const getAll = async () => {
    const query = `
        SELECT a.*, p.url as main_photo 
        FROM articles a 
        LEFT JOIN article_photos p ON a.id = p.article_id AND p.\`order\` = 0
    `;
    
    const [result] = await db.query(query);
    return result;
};

// Obtener detalle de un artículo con TODAS sus fotos (este lo dejamos igual porque ya es simple)
const getById = async (id) => {
    const [articleRows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (articleRows.length === 0) return null;

    const [photoRows] = await db.query('SELECT * FROM article_photos WHERE article_id = ? ORDER BY `order` ASC', [id]);
    
    const article = articleRows[0];
    article.photos = photoRows; 
    
    return article;
};

module.exports = { getAll, getById };