const UserModel = require('../models/users.model');
const ReportModel = require('../models/reports.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// devuelve todos los usuarios
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

// edita los datos de un mismo usuario pasandole el token
const edit = async (req, res) => {
    // El userId viene del token, no de la URL
    const userId = req.user.id;

    await UserModel.updateById(userId, req.body);
    const usuario = await UserModel.selectById(userId);

    res.json(usuario);
}

// crear un report
const create = async (req, res) => {
    const { type, article_id, reported_user_id, reason } = req.body;

    if (!type || !reason) {
        return res.status(400).json({ message: 'El tipo y el motivo son obligatorios' });
    }

    let body = {
        reporter_id: req.user.id,
        type,
        reason,
        article_id: null,
        reported_user_id: null
    };

    if (type === 'Articulo') {
        if (!article_id) {
            return res.status(400).json({ message: 'Falta el article_id para reportar un artículo' });
        }
        if (reported_user_id) {
            return res.status(400).json({ message: 'No se debe enviar reported_user_id cuando el tipo es Articulo' });
        }
        body.article_id = article_id;

    } else if (type === 'Usuario') {
        if (!reported_user_id) {
            return res.status(400).json({ message: 'Falta el reported_user_id para reportar un usuario' });
        }
        if (article_id) {
            return res.status(400).json({ message: 'No se debe enviar article_id cuando el tipo es Usuario' });
        }
        body.reported_user_id = reported_user_id;

    } else {
        return res.status(400).json({ message: "El tipo debe ser 'Articulo' o 'Usuario'" });
    }

    const result = await ReportModel.insert(body);
    const report = await ReportModel.selectById(result.insertId);

    res.status(201).json(report);
}



module.exports = {
    getAll, edit
}