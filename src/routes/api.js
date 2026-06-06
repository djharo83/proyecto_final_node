const router = require('express').Router();


// Ruta Diego
router.use('/categories', require('./api/categories'));
router.use('/favorites', require('./api/favorites'));


module.exports = router;