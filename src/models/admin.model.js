const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query(
        'SELECT * FROM users'
    );
    return result;
}

const selectById = async (userId) => {
    const [result] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    if (result.length === 0) return null;
    return result[0];
}

const updateRole = async (userId, role) => {
    const [result] = await db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
    );
    return result;
}

const updateStatus = async (userId, status) => {
    const [result] = await db.query(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, userId]
    );
    return result;
}

const deleteById = async (userId) => {
    const [result] = await db.query(
        'DELETE FROM users WHERE id = ?',
        [userId]
    );
    return result;
}

const updateById = async (userId, body) => {
    const { username, email, location } = body;
    const [result] = await db.query(
        'UPDATE users SET username = ?, email = ?, location = ? WHERE id = ?',
        [username, email, location, userId]
    );
    return result;
}

const getStats = async () => {
    const [articulosPublicados] = await db.query(
        "SELECT COUNT(*) AS total FROM articles WHERE status = 'Publicado'"
    );
    const [usuariosActivos] = await db.query(
        "SELECT COUNT(*) AS total FROM users WHERE status = 'Activo'"
    );
    const [reportesGestionados] = await db.query(
        "SELECT COUNT(*) AS total FROM reports WHERE status = 'Resuelto'"
    );
    const [articulosVendidos] = await db.query(
        "SELECT COUNT(*) AS total FROM articles WHERE status = 'Vendido'"
    );

    return {
        articulosPublicados: articulosPublicados[0].total,
        usuariosActivos: usuariosActivos[0].total,
        reportesGestionados: reportesGestionados[0].total,
        articulosVendidos: articulosVendidos[0].total
    };
}

const updatePassword = async (userId, newPasswordHash) => {
    const [result] = await db.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newPasswordHash, userId]
    );
    return result;
}



module.exports = { selectAll, selectById, updateRole, updateStatus, deleteById, updateById,getStats, updatePassword };