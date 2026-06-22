const router = require('express').Router();
const {getAll, edit , getById} = require('../../controllers/users.controller')
const {register,login} = require('../../controllers/loginregistro.controller')
const {checkToken} = require ('../../middlewares/auth.middleware')

// Acciones que puede hacer un usuario

router.post('/register', register);
router.post('/login', login);
router.get('/:userId', getById);
router.get('/', getAll);
router.put('/profile', checkToken, edit); 



module.exports = router;