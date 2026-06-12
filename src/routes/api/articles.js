const router = require('express').Router();
const upload = require('../../middlewares/upload.middleware'); 
const uploadToCloudinary = require('../../middlewares/cloudinary.middleware'); 
const { checkToken, isOwner } = require('../../middlewares/auth.middleware');
const { getAllArticles, 
        getLandingArticles, 
        getArticleById, 
        getMyArticles, 
        createArticle, 
        deleteArticle 
    } = require('../../controllers/articles.controller');



// RUTAS PÚBLICAS 
router.get('/', getAllArticles);
router.get('/landing', getLandingArticles);
router.get('/user/me', checkToken, getMyArticles);
router.get('/:id', getArticleById);


// RUTAS PROTEGIDAS
router.post('/', checkToken, upload.array('images', 5), uploadToCloudinary,  createArticle); // Permite subir hasta 5 imágenes por artículo
router.delete('/:id', checkToken, isOwner, deleteArticle);

module.exports = router;