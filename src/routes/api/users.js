const router = require('express').Router();
const { getAll, edit, getById } = require('../../controllers/users.controller');
const { register, login } = require('../../controllers/loginregistro.controller');
const { checkToken } = require('../../middlewares/auth.middleware');
const { validateSchema } = require('../../middlewares/validation.middleware');
const { registerSchema, loginSchema, editProfileSchema } = require('../../schemas/users.schema');

// Acciones que puede hacer un usuario
router.post('/register', validateSchema(registerSchema), register);
router.post('/login',    validateSchema(loginSchema),    login);
router.get('/',          checkToken, getAll);
router.get('/:userId',   checkToken, getById);
router.put('/profile',   checkToken, validateSchema(editProfileSchema), edit);

module.exports = router;