const router = require('express').Router();


// Nueva ruta de test
router.use('/test', require('./api/test'));
router.use('/users',require('./api/users'))


module.exports = router;