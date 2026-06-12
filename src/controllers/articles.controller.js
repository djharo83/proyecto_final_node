const cloudinary = require('../config/cloudinary'); 
const ArticlesModel = require('../models/articles.model');

// 1. Obtener todos los artículos (Con paginación y filtros)
const getAllArticles = async (req, res) => {
    try {
        // 1. Recogemos los parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        // 2. Recogemos los filtros
        const { category_id, min_price, max_price, condition, search, filterStatus } = req.query;
        const filters = { category_id, min_price, max_price, condition, search, filterStatus };
        
        // 3. Ejecutamos la búsqueda pasándolo todo al modelo
        const articles = await ArticlesModel.getAll(page, pageSize, filters);
        
        // Devolvemos metadatos de la página
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

// 2. Controlador para la Landing Page
const getLandingArticles = async (req, res) => {
    try {
        // Obtenemos simplemente los 10 últimos publicados, sin filtros
        // Le pasamos la página 1, límite 10, y un objeto de filtros vacío
        const articles = await ArticlesModel.getAll(1, 10, {});
        
        res.json({
            message: "Artículos recientes para la Landing",
            results: articles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 3. Obtener un artículo por su ID con sus fotos
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

// 4. Obtener los artículos del usuario logueado
const getMyArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        // El ID del usuario lo obtenemos inyectado por checkToken
        const loggedUserId = req.user.id;
        
        // Llamamos al modelo pasándole el user_id para filtrar solo los suyos
        const articles = await ArticlesModel.getAll(page, pageSize, { user_id: loggedUserId });
        
        res.json({
            info: { page, pageSize, count: articles.length },
            results: articles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 3. Crear un artículo subiendo imágenes (Archivos físicos) a Cloudinary
const createArticle = async (req, res) => {
    try {
        // Obtenemos los datos normales Y las URLs que nos inyectó nuestro middleware
        const { user_id, category_id, title, description, price, condition, location, photoUrls } = req.body;

        // Guardamos directamente en la base de datos
        const articleId = await ArticlesModel.create({
            user_id, category_id, title, description, price, condition, location
        }, photoUrls);

        res.status(201).json({
            message: "Artículo creado con éxito",
            articleId,
            photosUploaded: photoUrls
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Eliminar un artículo y sus fotos asociadas
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ArticlesModel.deleteById(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        
        res.json({ message: "Artículo eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllArticles, 
                   getLandingArticles, 
                   getArticleById, 
                   getMyArticles,
                   createArticle, 
                   deleteArticle };