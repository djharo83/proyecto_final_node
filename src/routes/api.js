const router = require('express').Router();


// Ruta Adrián:
router.use('/articles', require('./api/articles'));

// Ruta Jose 
// router.use('/users', require('./api/users'));

// Ruta Diego
//router.use('/categories', require('./api/categories'));
//router.use('/favorites', require('./api/favorites'));


module.exports = router;