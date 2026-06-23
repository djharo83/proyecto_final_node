
const ReportsModel = require('../models/reports.model');
const ArticlesModel = require("../models/articles.model");
const NotificationsModel =  require("../models/notifications.model"); 
const { StatusCodes } = require("http-status-codes");

// Usuarios 
const createReport = async (req, res) => {
    const { type, article_id, reported_user_id, reason } = req.body;

    if (!type || !reason) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'El tipo y el motivo son obligatorios' });
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
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Falta el article_id para reportar un artículo' });
        }
        if (reported_user_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No se debe enviar reported_user_id cuando el tipo es Articulo' });
        }
        body.article_id = article_id;

    } else if (type === 'Usuario') {
        if (!reported_user_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Falta el reported_user_id para reportar un usuario' });
        }
        if (article_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No se debe enviar article_id cuando el tipo es Usuario' });
        }
        body.reported_user_id = reported_user_id;

    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "El tipo debe ser 'Articulo' o 'Usuario'" });
    }

    const result = await ReportsModel.insert(body);

    //El usuario no necesita información del reporte.
    return res.status(StatusCodes.OK).json({ message: "Reporte creado correctamente."});
}

// Moderador

const getReportsPendingArticles = async (req, res, next) => {
    
    try {
        
        const reportSArticles = await ReportsModel.selectReportsPendingArticles();
        
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
        
        const reportArticle = await ReportsModel.selectReportPendingArticle(report_id);

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
        
        const reportsUsers = await ReportsModel.selectReportsPendingUsers();
        
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
        
        const reportUser = await ReportsModel.selectReportPendingUser(report_id);

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

    if (action !== 'accept' && action !== 'reject') {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Acción no válida" });
    };

    const connection = await db.getConnection();

    try{

        await connection.beginTransaction(); // Iniciamos la transacción

        // Obtener el detalle del reporte para sacar los datos del vendedor y el artículo
        const reportDetail = await ReportsModel.selectReportPendingArticle(report_id);
        if (!reportDetail) {
            await connection.rollback();
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Detalle del Reporte no encontrado." });
        };

        // Obtener los campos necesarios para la actulizacion del estado del articulo y la creacion de la notificacion
        const { seller_id, article_id, title: article_title, previous_status} = reportDetail;

        // Actualizar el estado del artículo.
        if (action === 'accept') {
            // El moderador lo retira definitivamente: previous_status pasa a ser NULL
            await ArticlesModel.updateArticleStatusGeneric(
                connection, 
                {   article_id : article_id,
                    new_status : 'Retirado',
                    new_previous_status : null
                }
            );
        } else if (action === 'reject') {
            // El moderador desestima el reporte: vuelve a su estado original y limpiamos el histórico
            await ArticlesModel.updateArticleStatusGeneric(
                connection, 
                {   article_id : article_id,
                    new_status : previous_status,
                    new_previous_status : null
                }
            );
        }
        
        // Actualizar el reporte a 'Resuelto'
        await ReportsModel.updateReport(connection, {moderator_id, moderator_note, report_id});

        // Crear la notificacion para informar al usuario de la resolucion del reporte
        const { notificationType, notificationContent } = buildReportNotificationData(action, article_title, moderator_note)

        // Ejecutamos el insert de la notificación
        await NotificationsModel.createNotification(connection, {
            user_id: seller_id,
            type: notificationType,
            content: notificationContent,
            reference_id: article_id
        });

        await connection.commit();

        return res.status(StatusCodes.OK)
        .json({ message: `Reporte resuelto correctamente. El artículo ha sido ${action === 'accept' ? 'retirado' : 'restaurado'}.`});


    }catch (error) {
        await connection.rollback(); // Si ocurre cualquier error deshacemos todo lo realizado para manterner consistentes los datos.
        next(error)
    } finally {
        connection.release(); // Liberamos la conexion.
    }
}

const getReportsHistory = async (req, res) => {
    
    try {
        
        const reportsHistory = await ReportModel.selectReportsHistory();
        
        return res.status(StatusCodes.OK).json({ results: reportsHistory });
    
    } catch (error) {
        next(error);
    }
}

const buildReportNotificationData = (action, article_title, moderator_note) => {
    
    if (action === 'accept') {
        return {
            notificationType: 'Articulo_Rechazado',
            notificationContent: `Tu artículo "${article_title}" ha sido retirado definitivamente de la plataforma por infringir las normas comunitarias. Motivo: ${moderator_note}`
        };
    } 
    
    if (action === 'reject') {
        return {
            notificationType: 'Articulo_Aprobado',
            notificationContent: `¡Buenas noticias! Tu artículo "${article_title}" ha sido revisado y se encuentra visible de nuevo. Motivo: ${moderator_note}`
        };
    }

    return { notificationType: '', notificationContent: '' };
};

module.exports = { createReport, 
                   getReportsPendingArticles, 
                   getReportsPendingUsers, 
                   getReportPendingArticle, 
                   getReportPendingUser, 
                   updateReportArticle,
                   getReportsHistory
                };
