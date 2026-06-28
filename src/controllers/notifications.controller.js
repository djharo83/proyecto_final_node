const NotificationsModel = require("../models/notifications.model");
const { StatusCodes } = require("http-status-codes");


const getUserNotifications = async (req, res, next) => {
    try {
        
      const userId = req.user.id;
        
      const notifications = await NotificationsModel.getByUserId(userId); 
        
      return res.status(StatusCodes.OK).json({ result: notifications });
   
      } catch (error) {
        next(error);
    }
};

const markNotificatationAsRead = async (req, res, next) => {
    try {
        const notification_id = req.params.id;

        const result = await NotificationsModel.updateNotificationAsRead(notification_id); 
        
        if (result.affectedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: "La notificación solicitada no existe." 
            });
        }

        return res.status(StatusCodes.OK).json({ message: "Notificación marcada como leída." });
    
      } catch (error) {
        next(error);
    }
};

module.exports = { getUserNotifications, markNotificatationAsRead };
