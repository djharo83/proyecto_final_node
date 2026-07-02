
const ReportsModel = require('../models/reports.model');
const ArticlesModel = require("../models/articles.model");
const NotificationsModel =  require("../models/notifications.model"); 
const { StatusCodes } = require("http-status-codes");
const db = require('../config/db');
const { ReportTypeEnum, 
        ActionResoluntionReportEnum, 
        ArticleStatusEnum, 
        NotificationTypeEnum } = require("../constants/enums.js"); 

// Usuarios 
const createReport = async (req, res, next) => {
    
    const { type, article_id, reported_user_id, reason } = req.body;
    const reporter_id = req.user.id;

    let body = {
        reporter_id,
        type,
        reason,
        article_id: null,
        reported_user_id: null
    };

    // Obtenemos una conexion para mantener la integridad de los datos en caso de que se produzca algún error.
    const connection = await db.getConnection();

    try{
    
        await connection.beginTransaction();

        if (type === ReportTypeEnum.ARTICLE) {

            if (!article_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Falta el article_id para reportar un artículo' });
            }
            if (reported_user_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No se debe enviar reported_user_id cuando el tipo es Articulo' });
            }
            
            body.article_id = article_id;

            // Obtener la información necesaria para actualizar el artículo
            const articleInfo = await ArticlesModel.getArticleInfo(connection, article_id);

            if (!articleInfo || articleInfo.status === ArticleStatusEnum.RETIRED) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    message: 'El articulo que quiere reportar no existe o ya ha sido resuelto por el moderador.'
                });
            }

            const {status:articleStatus, user_id:article_owner_id} = articleInfo;

            if (reporter_id === article_owner_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No puedes reportar un articulo que te pertenece' });
            }

            // Si el artículo ya está 'En revisión', no hacemos lógica de actualización de estados, 
            // pero SÍ permitimos que se inserte el reporte para que el moderador tenga constancia.
            if (articleStatus !== ArticleStatusEnum.UNDER_REVIEW) {
                await ArticlesModel.updateReportArticleStatus(
                    connection, 
                    {   
                        article_id : article_id,
                        new_status : ArticleStatusEnum.UNDER_REVIEW,
                        new_previous_status : articleStatus // Guardamos el estado actual del artículo
                    }
                );
            }

        } else {
            
            if (!reported_user_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Falta el reported_user_id para reportar un usuario' });
            }
            if (article_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No se debe enviar article_id cuando el tipo es Usuario' });
            }
            if (reported_user_id === reporter_id) {
                await connection.rollback();
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No puedes reportarte a ti mismo' });
            }
            
            body.reported_user_id = reported_user_id;
        }

        await ReportsModel.insert(connection, body);

        await connection.commit();

        //El usuario no necesita información del reporte.
        return res.status(StatusCodes.OK).json({ message: "Reporte creado correctamente."});

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
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
            return res.status(StatusCodes.NOT_FOUND).json({ message: "El reporte no existe, ya fue procesado o no corresponde a un artículo." });
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
            return res.status(StatusCodes.NOT_FOUND).json({ message: "El reporte no existe, ya fue procesado o no corresponde a un usuario." });
        }

        return res.status(StatusCodes.OK).json({ reportUser });
    
    } catch (error) {
        next(error);
    }
}

const updateReportAndArticle = async (req, res, next) => {
    
    const { action, moderator_note } = req.body;
    
    const report_id = req.params.id;
    
    const moderator_id = req.user.id; 

    const connection = await db.getConnection();

    try{

        await connection.beginTransaction(); // Iniciamos la transacción

        // Obtener el detalle del reporte para sacar los datos del vendedor y el artículo
        const reportDetail = await ReportsModel.selectReportPendingArticle(report_id);
        if (!reportDetail) {
            await connection.rollback();
            return res.status(StatusCodes.NOT_FOUND).json({ message: "El reporte que quiere resolver no existe o ha sido resuelto." });
        };

        // Obtener los campos necesarios para la actulizacion del estado del articulo y la creacion de la notificacion
        const { seller_id, article_id, title: article_title, previous_status} = reportDetail;

        // Actualizar el estado del artículo.
        if (action === ActionResoluntionReportEnum.ACCEPT) {
            // El moderador lo retira definitivamente: previous_status pasa a ser NULL
            await ArticlesModel.updateReportArticleStatus(
                connection, 
                {   article_id : article_id,
                    new_status : ArticleStatusEnum.RETIRED,
                    new_previous_status : null
                }
            );
        } else {
            // El moderador desestima el reporte: vuelve a su estado original y limpiamos el histórico
            await ArticlesModel.updateReportArticleStatus(
                connection, 
                {   article_id : article_id,
                    new_status : previous_status,
                    new_previous_status : null
                }
            );
        }
        
        // Actualizar el reporte a 'Resuelto'
        await ReportsModel.updateReport(connection, {moderator_id, moderator_note, article_id});

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

        // Notificación en tiempo real para el usuario
        const io = req.app.get('io'); // Esto es posible recuperar la instancia del webSocket porque en index hemos compartido la instanci app.set('io', io); y podemos recuperarla en el controlador
        if (io) {
            const userRoom = `user_${seller_id}`;
            io.to(userRoom).emit('new_notification', {
                type: notificationType,
                content: notificationContent,
                reference_id: article_id,
                created_at: new Date()
            });
            console.log(`Notificación enviada por Socket al canal: ${userRoom}`);
        }

        return res.status(StatusCodes.OK).json({ 
            message: `Reporte resuelto correctamente. El artículo ha sido ${
                action === ActionResoluntionReportEnum.ACCEPT 
                    ? ArticleStatusEnum.RETIRED 
                    : `devuelto a su estado original (${previous_status})`
            }.`
        });

    }catch (error) {
        await connection.rollback(); // Si ocurre cualquier error deshacemos todo lo realizado para manterner consistentes los datos.
        next(error)
    } finally {
        connection.release(); // Liberamos la conexion.
    }
}

const getReportsHistory = async (req, res, next) => {
    
    try {
        
        const reportsHistory = await ReportsModel.selectReportsHistory();
        
        return res.status(StatusCodes.OK).json({ results: reportsHistory });
    
    } catch (error) {
        next(error);
    }
}

const buildReportNotificationData = (action, article_title, moderator_note) => {
    
    if (action === ActionResoluntionReportEnum.ACCEPT) {
        return {
            notificationType: NotificationTypeEnum.REJECTED,
            notificationContent: `Tu artículo "${article_title}" ha sido retirado definitivamente de la plataforma por infringir las normas comunitarias. Motivo: ${moderator_note}`
        };
    } 
    
    return {
        notificationType: NotificationTypeEnum.APPROVED,
        notificationContent: `¡Buenas noticias! Tu artículo "${article_title}" ha sido revisado y se encuentra visible de nuevo. Motivo: ${moderator_note}`
    };
};

module.exports = { createReport, 
                   getReportsPendingArticles, 
                   getReportsPendingUsers, 
                   getReportPendingArticle, 
                   getReportPendingUser, 
                   updateReportAndArticle,
                   getReportsHistory
                };
