
const db = require('../config/db');

// Moderador
const createNotification = async (connection, { user_id, type, content, reference_id }) => {
    const query = `
        INSERT INTO notifications (user_id, type, content, reference_id, is_read, created_at)
        VALUES (?, ?, ?, ?, '0', NOW())`;
    // Pasamos 'connection' para que pueda ejecutarse dentro de la misma transacción
    const [result] = await connection.query(query, [user_id, type, content, reference_id]);
    return result;
};

module.exports = { createNotification };
