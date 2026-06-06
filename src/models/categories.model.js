const db = require('../config/db');

const getAllUsers = async () => {
 
    const [result] = await db.query('SELECT * FROM users');
    return result; // Devolvemos el array completo de usuarios
};

module.exports = { getAllUsers };