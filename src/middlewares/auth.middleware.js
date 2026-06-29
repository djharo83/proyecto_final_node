const jwt = require('jsonwebtoken');
const UserModel = require('../models/users.model');
const ArticlesModel = require('../models/articles.model');


const checkToken = async (req, res, next) => {
    // ¿Está el token en la cabecera?
    
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({
            message: 'El token es obligatorio en la cabecera Authorization'
        });
    }

    // ¿Es un token válido?
    // Separamos "Bearer" del token usando el espacio intermedio (swagger y postman lo envían así)
    let token = authHeader;
if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
}

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

// Comprueba si el usuario autenticado es el creador del artículo o tiene rol de moderación o administrador
const isOwner = async (req, res, next) => {
    try {
        // Como 'checkArticleId' se ejecutará justo antes en la ruta, ya tenemos el artículo aquí:
        const article = req.article; 

        // 1. Si el usuario es el dueño legítimo, le dejamos pasar
        if (article.user_id === req.user.id) {
            return next();
        }

        // 2. Si no es el dueño, comprobamos si es Moderador o Administrador
        const rolesPrivilegiados = ['Moderador', 'Administrador'];
        if (rolesPrivilegiados.includes(req.user.role)) {
            return next(); 
        }

        // 3. Si no es el dueño ni tiene rol privilegiado, denegamos el acceso
        return res.status(403).json({ 
            message: 'Acceso denegado: No eres el propietario de este artículo ni tienes permisos de moderación' 
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { checkToken, checkRole, isOwner }
