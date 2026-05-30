const router = require('express').Router();
const { getAllArticles, getArticleById } = require('../../controllers/articles.controller');

router.get('/', getAllArticles);
router.get('/:id', getArticleById);

module.exports = router;