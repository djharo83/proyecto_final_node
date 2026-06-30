const AdminModel = require('../models/admin.model');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const users = await AdminModel.selectAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Hay un error gravísimo' });
    }
}

const getUserById = async (req, res) => {
    const { userId } = req.params;

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    res.json(user);
}

const changeRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const rolesValidos = ['Usuario', 'Moderador', 'Administrador'];
    if (!rolesValidos.includes(role)) {
        return res.status(400).json({ message: `El rol debe ser uno de: ${rolesValidos.join(', ')}` });
    }

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    await AdminModel.updateRole(userId, role);
    const userActualizado = await AdminModel.selectById(userId);

    res.json(userActualizado);
}

const blockUser = async (req, res) => {
    const { userId } = req.params;

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    await AdminModel.updateStatus(userId, 'Bloqueado');
    const userActualizado = await AdminModel.selectById(userId);

    res.json(userActualizado);
}

const unblockUser = async (req, res) => {
    const { userId } = req.params;

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    await AdminModel.updateStatus(userId, 'Activo');
    const userActualizado = await AdminModel.selectById(userId);

    res.json(userActualizado);
}

const removeUser = async (req, res) => {
    const { userId } = req.params;

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    await AdminModel.deleteById(userId);

    res.json({ message: 'Usuario eliminado correctamente' });
}

const editUser = async (req, res) => {
    const { userId } = req.params;

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    await AdminModel.updateById(userId, req.body);
    const userActualizado = await AdminModel.selectById(userId);

    res.json(userActualizado);
}

const getStats = async (req, res) => {
    try {
        const stats = await AdminModel.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Hay un error gravísimo' });
    }
}

const changeUserPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await AdminModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 8);
    await AdminModel.updatePassword(userId, newPasswordHash);

    res.json({ message: `Contraseña del usuario ${user.username} actualizada correctamente` });
}


module.exports = { getAllUsers, getUserById, changeRole, blockUser, unblockUser, removeUser, editUser, getStats , changeUserPassword};