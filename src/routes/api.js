const router = require('express').Router();

// Ruta Diego
router.use('/categories', require('./api/categories'));
router.use('/favorites', require('./api/favorites'));

// Ruta Jose 
router.use('/users',require('./api/users'));
router.use('/landing', require('./api/loginregistro'))


// Ruta Adrián:
router.use('/articles', require('./api/articles'));

module.exports = router;