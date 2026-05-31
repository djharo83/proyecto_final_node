const router = require('express').Router();
const {getAll,register,login} = require('../../controllers/users.controller')


router.get('/',getAll);
router.post('/register', register);
router.post('/login', login);



module.exports = router;