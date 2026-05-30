const router = require('express').Router();
const { getAllArticles, getArticleById, createArticle, deleteArticle } = require('../../controllers/articles.controller');

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', createArticle); 
router.delete('/:id', deleteArticle);

module.exports = router;