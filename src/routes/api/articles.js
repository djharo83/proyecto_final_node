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


// Middleware de seguridad
const upload = require('../../middlewares/upload.middleware'); 
const uploadToCloudinary = require('../../middlewares/cloudinary.middleware'); 
const { checkToken, isOwner } = require('../../middlewares/auth.middleware');
const { checkArticleId } = require('../../middlewares/articles.middleware'); 
const { validateSchema } = require('../../middlewares/validation.middleware'); 
const { articleSchema, statusSchema } = require('../../schemas/articles.schema'); 



// RUTAS PÚBLICAS 
router.get('/', getAllArticles);
router.get('/landing', getLandingArticles);
router.get('/user/me', checkToken, getMyArticles);
router.get('/:id', checkArticleId,getArticleById);


// RUTAS PROTEGIDAS
router.post(  '/',           checkToken, upload.array('images', 5), uploadToCloudinary, validateSchema(articleSchema), createArticle);
router.put(   '/:id',        checkToken, checkArticleId, isOwner,                       validateSchema(articleSchema), updateArticle); 
router.patch( '/:id/status', checkToken, checkArticleId, isOwner,                       validateSchema(statusSchema),  updateArticleStatus);
router.delete('/:id',        checkToken, checkArticleId, isOwner,                                                      deleteArticle);
module.exports = router;