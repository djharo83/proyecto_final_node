const router = require('express').Router();
const { checkDb } = require('../../controllers/test.controller');

router.get('/', checkDb);

module.exports = router;