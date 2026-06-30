const LoginRegistroModel = require('../models/loginregistro.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    // Body: username,email,password
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    const result = await LoginRegistroModel.insert(req.body);
    const usuario = await LoginRegistroModel.selectById(result.insertId)
    res.status(201).json({
        message: 'Usuario creado correctamente',
        user: usuario});
}

const login = async(req, res) => {
    
    //body: email,password
    const { email, password} = req.body;


    // ¿Existe el email en la BD?
    const user = await LoginRegistroModel.selectByEmail(email)
    if (!user) {
        res.status(401).json({
            message: 'Error email y/o contraseña'
        })
    }

    // ¿Coinciden las password?
    const iguales = bcrypt.compareSync(password, user.password_hash);
    if (!iguales){
        res.status(401).json({
            message: 'Error email y/o contraseña'
        })
    }

    res.json({
    message: 'Login correcto',
    token: jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    ),
    role: user.role
});

}

const changePassword = async (req, res) => {
    // El userId viene del token
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Obtenemos el usuario para comprobar su contraseña actual
    const user = await LoginRegistroModel.selectById(userId);
    if (!user) {
        return res.status(404).json({ message: 'El usuario no existe' });
    }

    // ¿Coincide la contraseña actual?
    const iguales = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!iguales) {
        return res.status(401).json({ message: 'La contraseña actual no es correcta' });
    }

    // Encriptamos y guardamos la nueva contraseña
    const newPasswordHash = bcrypt.hashSync(newPassword, 8);
    await LoginRegistroModel.updatePassword(userId, newPasswordHash);

    res.json({ message: 'Contraseña actualizada correctamente' });
}



module.exports = {
    register,login,changePassword
}