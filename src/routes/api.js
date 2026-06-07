const router = require('express').Router();


// Ruta Jose 
router.use('/users',require('./api/users'));

// Ruta Adrián:
router.use('/articles', require('./api/articles'));

module.exports = router;