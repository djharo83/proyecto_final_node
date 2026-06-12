const router = require('express').Router();
const { getAllArticles, getLandingArticles, getArticleById, createArticle, deleteArticle } = require('../../controllers/articles.controller');
const upload = require('../../middlewares/upload.middleware'); 
const uploadToCloudinary = require('../../middlewares/cloudinary.middleware'); 
const { checkToken, isOwner } = require('../../middlewares/auth.middleware');



// RUTAS PÚBLICAS 
router.get('/', getAllArticles);
router.get('/landing', getLandingArticles);
router.get('/:id', getArticleById);

// RUTAS PROTEGIDAS
router.post('/', checkToken, upload.array('images', 5), uploadToCloudinary,  createArticle); // Permite subir hasta 5 imágenes por artículo
router.delete('/:id', checkToken, isOwner, deleteArticle);

module.exports = router;