
const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM reports');
    return result;
}

const selectById = async (reportId) => {
    const [result] = await db.query(
        'SELECT * FROM reports WHERE id = ?',
        [reportId]
    );
    if (result.length === 0) return null;
    return result[0];
}

const insert = async (body) => {
    const { reporter_id, article_id, reported_user_id, type, reason } = body;
    const [result] = await db.query(
        `INSERT INTO reports (reporter_id, article_id, reported_user_id, type, reason, status)
         VALUES (?, ?, ?, ?, ?, 'Pendiente')`,
        [reporter_id, article_id || null, reported_user_id || null, type, reason]
    );
    return result;
}

module.exports = { selectAll, selectById, insert };
