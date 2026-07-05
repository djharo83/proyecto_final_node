const UserModel = require('../models/users.model');

// devuelve todos los usuarios
const getAll = async (req, res) => {
    try {
        const clientes = await UserModel.selectAll();
        res.json(clientes);
    } catch(error){
        res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

// edita los datos de un mismo usuario pasandole el token
const edit = async (req, res) => {
    // El userId viene del token, no de la URL
    const userId = req.user.id;

    await UserModel.updateById(userId, req.body);
    const usuario = await UserModel.selectById(userId);

    res.json(usuario);
}


const getById = async (req, res) => {
    const { userId } = req.params;

    const usuario = await UserModel.selectById(userId);
    if (!usuario) {
        return res.status(404).json({ message: 'El usuario no existe con ese ID' });
    }

    res.json(usuario);
}


module.exports = {
    getAll, edit , getById
}