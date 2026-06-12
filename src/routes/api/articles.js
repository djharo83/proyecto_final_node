const router = require('express').Router();
const { getAllArticles, getLandingArticles, getArticleById, createArticle, deleteArticle } = require('../../controllers/articles.controller');
const upload = require('../../middlewares/upload.middleware'); 
const uploadToCloudinary = require('../../middlewares/cloudinary.middleware'); 




router.get('/', getAllArticles);
router.get('/landing', getLandingArticles);
router.get('/:id', getArticleById);
router.post('/', upload.array('images', 5), uploadToCloudinary,  createArticle); // Permite subir hasta 5 imágenes por artículo
router.delete('/:id', deleteArticle);

module.exports = router;