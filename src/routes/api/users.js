const router = require('express').Router();
const {getAll, edit,create} = require('../../controllers/users.controller')
const {register,login} = require('../../controllers/loginregistro.controller')
const {checkToken} = require ('../../middlewares/auth.middleware')

// Acciones que puede hacer un usuario

router.post('/register', register);
router.post('/login', login);
router.put('/profile', checkToken, edit); 
router.post('/reports',checkToken, create);


module.exports = router;