
const ReportModel = require('../models/reports.model');
const ArticleModel = require("../models/articles.model");
const { StatusCodes } = require("http-status-codes");

// Usuarios 
const createReport = async (req, res) => {
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

// Moderador

const getReportsPendingArticles = async (req, res, next) => {
    
    try {
        
        const reportSArticles = await ReportModel.selectReportsPendingArticles();
        
        return res.status(StatusCodes.OK).json({ results: reportSArticles });
    
    } catch (error) {
        next(error);
    }
}

const getReportPendingArticle = async (req, res, next) => {
    
    const {id : report_id } = req.params;

    if (!report_id)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Report ID requerido" });

    try {
        
        const reportArticle = await ReportModel.selectReportPendingArticle(report_id);

        if (!reportArticle) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Reporte Artículo no encontrada" });
        }

        return res.status(StatusCodes.OK).json({ reportArticle });
    
    } catch (error) {
        next(error);
    }
}

const getReportsPendingUsers = async (req, res, next) => {
    
    try {
        
        const reportsUsers = await ReportModel.selectReportsPendingUsers();
        
        return res.status(StatusCodes.OK).json({ results: reportsUsers });
    
    } catch (error) {
        next(error);
    }
}

const getReportPendingUser = async (req, res, next) => {
    
    const {id : report_id } = req.params;

    if (!report_id)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Report ID requerido" });

    try {
        
        const reportUser = await ReportModel.selectReportPendingUser(report_id);

        if (!reportUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Reporte Usuario no encontrada" });
        }

        return res.status(StatusCodes.OK).json({ reportUser });
    
    } catch (error) {
        next(error);
    }
}

const updateReportArticle = async (req, res, next) => {
    
    const { action, moderator_note } = req.body;
    
    const report_id = req.params.id;
    
    const moderator_id = req.user.id;

    const report = await ReportModel.selectReportById(report_id);

    if(!report){
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Reporte no encontrado" });
    }

    const article_id = report.article_id;

    if (action !== 'accept' && action !== 'reject') {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Acción no válida" });
    }

    try{

        await ArticleModel.updateArticleStatus(article_id, action);

        // Se actualiza el reporte a 'Resuelto'
        await ReportModel.updateReport(moderator_id, moderator_note, report_id);

        return res.status(StatusCodes.OK).json({message: "Reporte actualizado exitosamente", result: {
        ...report,
        status: 'Resuelto',
        moderator_id: moderator_id,
        moderator_note: moderator_note,
        resolved_at: new Date()
        }});

    }catch (error) {
        next(error)
    };
}

const getReportsHistory = async (req, res) => {
    
    try {
        
        const reportsHistory = await ReportModel.selectReportsHistory();
        
        return res.status(StatusCodes.OK).json({ results: reportsHistory });
    
    } catch (error) {
        next(error);
    }
}

module.exports = { createReport, 
                   getReportsPendingArticles, 
                   getReportsPendingUsers, 
                   getReportPendingArticle, 
                   getReportPendingUser, 
                   updateReportArticle,
                   getReportsHistory
                };
