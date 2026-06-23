
const ReportModel = require('../models/reports.model');
const ArticleModel = require('../models/articles.model');

const getAll = async (req, res) => {
    try {
        const reports = await ReportModel.selectAll();
        res.json(reports);
    } catch (error) {
        res.status(500).json({
            message: 'Hay un error gravísimo'
        });
    }
}

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

    if (type === 'Articulo') {
            await ArticleModel.updateStatus(article_id, 'En revisión');
    }

    res.status(201).json(report);
}

module.exports = { getAll, create };
