const router = require('express').Router();
const {getAll,register,login, edit} = require('../../controllers/users.controller')
const {checkToken} = require ('../../middlewares/auth.middleware')

router.get('/',getAll);
router.post('/register', register);
router.post('/login', login);
router.put('/profile', checkToken, edit); 


module.exports = router;