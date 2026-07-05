const router = require('express').Router();
const {
    getAllUsers, getUserById, editUser, changeRole, blockUser, unblockUser, removeUser, getStats ,changeUserPassword
} = require('../../controllers/admin.controller');

const { checkToken, checkRole } = require('../../middlewares/auth.middleware');

router.use(checkToken, checkRole(['Administrador']));

router.get('/stats',              getStats);
router.get('/users',              getAllUsers);
router.get('/users/:userId',      getUserById);
router.put('/users/:userId',      editUser);
router.put('/users/:userId/role', changeRole);
router.put('/users/:userId/block',   blockUser);
router.put('/users/:userId/unblock', unblockUser);
router.put('/users/:userId/password', changeUserPassword);
router.delete('/users/:userId',   removeUser);

module.exports = router;










