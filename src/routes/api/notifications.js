const router = require("express").Router();
const {checkToken} = require ('../../middlewares/auth.middleware')
const notificacionController = require("../../controllers/notifications.controller");


router.get('/user', checkToken, notificacionController.getUserNotifications);
router.put('/:id/read', checkToken, notificacionController.markNotificatationAsRead);

module.exports = router;
