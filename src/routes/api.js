const router = require('express').Router();

// Rutas Diego
router.use('/categories', require('./api/categories'));
router.use('/favorites', require('./api/favorites'));
router.use('/notifications', require('./api/notifications'));

// Rutas Jose 
router.use('/users',require('./api/users'));
//Rutas Jose/Diego
router.use('/reports', require('./api/reports'));
//Rutas Jose 
router.use('/admin', require('./api/admin'));


// Ruta sAdrián:
router.use('/articles', require('./api/articles'));
router.use('/messages', require('./api/messages'));
router.use('/conversations', require('./api/conversations')); 

module.exports = router;