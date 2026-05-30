const ArticlesModel = require('../models/articles.model');

const getAllArticles = async (req, res) => {
    try {
        // 1. Recogemos los parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        // 2. Recogemos los filtros
        const { category_id, min_price, max_price, condition } = req.query;
        const filters = { category_id, min_price, max_price, condition };
        
        // 3. Ejecutamos la búsqueda pasándolo todo al modelo
        const articles = await ArticlesModel.getAll(page, pageSize, filters);
        
        // (Opcional, pero muy pro para Front): Devolvemos metadatos de la página
        res.json({
            info: {
                page: page,
                pageSize: pageSize,
                count: articles.length
            },
            results: articles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await ArticlesModel.getById(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllArticles, getArticleById };