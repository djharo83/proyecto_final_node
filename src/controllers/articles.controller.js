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


// 2. Obtener un artículo por su ID con sus fotos
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

// 3. Obtener los artículos del usuario logueado
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


// 4. Crear un artículo subiendo imágenes a Cloudinary (Protegido contra suplantación)
const createArticle = async (req, res) => {
    try {
        // Quitamos user_id del req.body
        const { category_id, title, description, price, condition, location, photoUrls } = req.body;
        
        // ¡Mejora de seguridad! Extraemos el ID directamente del token verificado
        const user_id = req.user.id; 

        // Guardamos en la base de datos usando el ID seguro
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


// 5. Controlador para editar todo el artículo (PUT)
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ejecutamos la actualización y el modelo nos devolverá el artículo ya modificado
        const updatedArticle = await ArticlesModel.updateById(id, req.body);
        
        if (!updatedArticle) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        
        res.json({
            message: "Artículo actualizado con éxito",
            article: updatedArticle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Controlador para cambiar solo el estado/status (PATCH)
const updateArticleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Esperamos recibir por ejemplo: { "status": "Vendido" }
        
        if (!status) {
            return res.status(400).json({ message: "El campo status es obligatorio" });
        }
        
        const updatedArticle = await ArticlesModel.updateStatus(id, status);
        
        if (!updatedArticle) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        
        res.json({
            message: `Estado del artículo actualizado a '${status}' con éxito`,
            article: updatedArticle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 7. Eliminar un artículo y sus fotos asociadas
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
                   getArticleById, 
                   getMyArticles,
                   createArticle, 
                   updateArticle,
                   updateArticleStatus,
                   deleteArticle };

                   