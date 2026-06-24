
const db = require('../config/db');

// Usuario
const insert = async (conection, body) => {
    const { reporter_id, article_id, reported_user_id, type, reason } = body;
    const [result] = await conection.query(
        `INSERT INTO reports (reporter_id, article_id, reported_user_id, type, reason, status)
         VALUES (?, ?, ?, ?, ?, 'Pendiente')`,
        [reporter_id, article_id || null, reported_user_id || null, type, reason]
    );
    return result;
}

// Moderador

const selectReportsPendingArticles = async () => {
    
    let query = `SELECT 
    r.id AS report_id,
    r.reason AS report_reason,
    r.created_at AS report_created_at,
    u_reporter.username AS reporter_username,
    a.id AS article_id,
    a.title AS article_title,
    a.price AS article_price
        FROM reports r
        INNER JOIN users u_reporter ON r.reporter_id = u_reporter.id
        INNER JOIN articles a ON r.article_id = a.id
        WHERE r.status = 'Pendiente' AND r.type = 'Articulo'
        ORDER BY r.created_at DESC`;

    const [result] = await db.query(query);
    
    return result;
}

const selectReportPendingArticle = async (report_id) => {

    let query = `SELECT 
    r.id AS report_id, r.reason, r.created_at,
    a.id AS article_id, a.title, a.description, a.price, a.condition,
    a.location, a.previous_status, a.status,
    u_seller.id AS seller_id,
    u_seller.username AS seller_username,
	JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', ap.id,
            'url', ap.url,
            'order', ap.order
        )
    ) AS photos
    FROM reports r
    INNER JOIN articles a ON r.article_id = a.id
    LEFT JOIN article_photos ap ON ap.article_id = a.id
    INNER JOIN users u_seller ON a.user_id = u_seller.id 
    WHERE r.id = ?
    GROUP BY r.id, a.id`;

    const [result] = await db.query(query, [report_id]);
    
    if (!result || result.length === 0) {
        return null;
    }

    const row = result[0];

    // En caso de que la consulta devuelva strings JSON, los convertimos en objetos/arrays reales de JS
    return {
        ...row,// Mantenemos todas las propiedades originales y nos evitamos tener que escribirlas
        photos: typeof row.photos === 'string' ? JSON.parse(row.photos) : row.photos
    };  
}

const selectReportsPendingUsers = async () => {
    
    let query = `SELECT 
    r.id AS report_id,
    r.reason AS report_reason,
    r.created_at AS report_created_at,
    u_reporter.username AS reporter_username,
    u_reported.id AS reported_user_id,
    u_reported.username AS reported_username
        FROM reports r
        INNER JOIN users u_reporter ON r.reporter_id = u_reporter.id
        INNER JOIN users u_reported ON r.reported_user_id = u_reported.id
        WHERE r.status = 'Pendiente' AND r.type = 'Usuario'
        ORDER BY r.created_at DESC`;

    const [result] = await db.query(query);
    
    return result;
}

const selectReportPendingUser = async (report_id) => {

    let query = `SELECT 
    r.id AS report_id, r.reason, r.created_at,
	u_reporter.id AS reporter_user_id,
    u_reporter.username AS reporter_username,
    u_reported.id AS reported_user_id,
    u_reported.username AS reported_username,
	u_reported.email AS reported_email,
	u_reported.avatar_url AS reported_avatar,
	u_reported.avg_rating AS reported_avg_rating,
	u_reported.location AS reported_location,
    u_reported.status AS reported_status
        FROM proyecto_final_segunda_mano_db.reports r
        INNER JOIN users u_reporter ON r.reporter_id = u_reporter.id
        INNER JOIN users u_reported ON r.reported_user_id = u_reported.id
        WHERE r.id = ?`;

    const [result] = await db.query(query, [report_id]);
    
    return result[0] || null;
}

const selectReportsHistory = async () => {
    
    let query = `SELECT 
    r.id AS report_id,
    r.type AS report_type,
    r.reason AS report_reason,
    r.moderator_note AS resolution_note,
    r.resolved_at AS resolution_date,
    u_mod.username AS moderator_username,
    u_reporter.username AS reporter_username
        FROM reports r
        INNER JOIN users u_mod ON r.moderator_id = u_mod.id
        INNER JOIN users u_reporter ON r.reporter_id = u_reporter.id
        WHERE r.status = 'Resuelto'
        ORDER BY r.resolved_at DESC`;

    const [result] = await db.query(query);
    
    return result;
}

const updateReport = async (connection, {moderator_id, moderator_note, report_id}) => {

    let query = `UPDATE reports 
            SET status = 'Resuelto',
                moderator_id = ?,
                moderator_note = ?,
                resolved_at = NOW()
            WHERE id = ?`;

    const [result] = await connection.query(query, [moderator_id, moderator_note, report_id]);
  
    return result;

}

module.exports = { insert, 
                   selectReportsPendingArticles, 
                   selectReportPendingArticle, 
                   selectReportsPendingUsers, 
                   selectReportPendingUser, 
                   selectReportsHistory,
                   updateReport};
