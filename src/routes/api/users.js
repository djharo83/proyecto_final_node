const router = require('express').Router();
const {edit} = require('../../controllers/users.controller')
const {register,login} = require('../../controllers/loginregistro.controller')
const {checkToken} = require ('../../middlewares/auth.middleware')

// Acciones que puede hacer un usuario

router.post('/register', register);
router.post('/login', login);
router.put('/profile', checkToken, edit); 

module.exports = router;