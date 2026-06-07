const jwt = require('jsonwebtoken');
const UserModel = require('../models/users.model');

const checkToken = async (req, res, next) => {
    // ¿Está el token en la cabecera?
    if (!req.headers['authorization']) {
        return res.status(403).json({
            message: 'El token es obligatorio en la cabecera Authorization'
        });
    }

    // ¿Es un token válido?
    const token = req.headers.authorization;

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(payload);
    } catch (error) {
        return res.status(403).json({
            message: 'El token es incorrecto'
        });
    }

    // ¿Existe el usuario al que refiere el token?
    const user = await UserModel.selectById(payload.userId);
    if (!user) {
        return res.status(403).json({
            message: 'El usuario no existe'
        });
    }

    req.user = user;
    next();
}

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Recurso solo accesible para ${roles.join(',')}`
            });
        }
        next();
    }
}

module.exports = { checkToken, checkRole }