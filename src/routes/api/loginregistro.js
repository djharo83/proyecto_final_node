const router = require('express').Router();
const {register,login} = require('../../controllers/loginregistro.controller')



router.post('/register', register);
router.post('/login', login);



module.exports = router;