
const db = require('../config/db');
const { NotificationTypeEnum } = require("../constants/enums.js"); 

// Moderador
const createNotification = async (connection, { user_id, type, content, reference_id }) => {
    const query = `
        INSERT INTO notifications (user_id, type, content, reference_id, is_read, created_at)
        VALUES (?, ?, ?, ?, '0', NOW())`;
    // Pasamos 'connection' para que pueda ejecutarse dentro de la misma transacción
    const [result] = await connection.query(query, [user_id, type, content, reference_id]);
    return result;
};

const getByUserId = async (user_id) => {
    const query = `SELECT * FROM notifications 
                    WHERE is_read = 0
                    AND type IN (?, ?)
                    AND user_id = ?
                    ORDER BY created_at DESC`;
    // Pasamos 'connection' para que pueda ejecutarse dentro de la misma transacción
    const [result] = await db.query(query, [NotificationTypeEnum.APPROVED, NotificationTypeEnum.REJECTED, user_id]);
    return result;
};

const updateNotificationAsRead = async (notification_id) => {
    const query = `UPDATE notifications SET is_read = 1 WHERE id = ?`;
    // Pasamos 'connection' para que pueda ejecutarse dentro de la misma transacción
    const [result] = await db.query(query, [notification_id]);
    return result;
};

module.exports = { createNotification, getByUserId, updateNotificationAsRead };