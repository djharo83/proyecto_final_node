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

module.exports = { selectAll, selectById, updateRole, updateStatus, deleteById, updateById };