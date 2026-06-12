const router = require('express').Router();

const { getAllArticles, 
        getLandingArticles, 
        getArticleById, 
        getMyArticles, 
        createArticle, 
        updateArticle, 
        updateArticleStatus,
        deleteArticle 
    } = require('../../controllers/articles.controller');

const upload = require('../../middlewares/upload.middleware'); 
const uploadToCloudinary = require('../../middlewares/cloudinary.middleware'); 

// Middleware de seguridad
const { checkToken, isOwner } = require('../../middlewares/auth.middleware');




// RUTAS PÚBLICAS 
router.get('/', getAllArticles);
router.get('/landing', getLandingArticles);
router.get('/user/me', checkToken, getMyArticles);
router.get('/:id', getArticleById);


// RUTAS PROTEGIDAS
// Crear artículo (Solo pide estar logueado)
// Permite subir hasta 5 imágenes por artículo
router.post('/', checkToken, upload.array('images', 5), uploadToCloudinary,  createArticle); 

// Editar artículo completo (Pide token y ser el propietario)
router.put('/:id', checkToken, isOwner, updateArticle); 

// Marcar como vendido / Cambiar estado (Pide token y ser el propietario)
router.patch('/:id/status', checkToken, isOwner, updateArticleStatus);

// Borrar artículo (Pide token y ser el propietario)
router.delete('/:id', checkToken, isOwner, deleteArticle);

module.exports = router;