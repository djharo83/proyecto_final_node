const ArticlesModel = require('../models/articles.model');

const getAllArticles = async (req, res) => {
    try {
        // Llamamos al modelo directamente, sin pasarle nada
        const articles = await ArticlesModel.getAll();
        res.json(articles);
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