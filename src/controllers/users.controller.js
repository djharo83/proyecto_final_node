const UserModel = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getAll = async (req, res) => {
    try {
        const clientes = await UserModel.selectAll();
        res.json(clientes);
    } catch(error){
        res.status(500).json({
            message: 'Hay un error gravvisimo'
        });
    }
}

const register = async (req, res) => {
    // Body: username,email,password
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    const result = await UserModel.insert(req.body);
    res.json(result);
}

const login = async(req, res) => {
    
    //body: email,password
    const { email, password} = req.body;


    // ¿Existe el email en la BD?
    const user = await UserModel.selectByEmail(email)
    if (!user) {
        res.status(401).json({
            message: 'Error email y/o contraseña 1'
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
        token: jwt.sign( {userId: user.id , rol: user.rol}, process.env.JWT_SECRET_KEY)
    });

}



module.exports = {
    getAll, register,login
}