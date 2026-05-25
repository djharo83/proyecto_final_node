const router = require('express').Router();


// Nueva ruta de test
router.use('/test', require('./api/test'));


module.exports = router;