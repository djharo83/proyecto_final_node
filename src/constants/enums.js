const ReportTypeEnum = Object.freeze({
    ARTICLE: 'Articulo',
    USER: 'Usuario'
});

const ActionResoluntionReportEnum = Object.freeze({
    ACCEPT: 'accept',
    REJECT: 'reject'
});

const ArticleStatusEnum = Object.freeze({
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    UNDER_REVIEW: 'En revisión',
    ARCHIVED: 'Retirado',
    SOLD: 'Vendido',
    RESERVED: 'Reservado'
});

const ReportStatusEnum = Object.freeze({
    PENDING: 'Pendiente',
    RESOLVED: 'Resuelto'
});

const NotificationTypeEnum = Object.freeze({
    APPROVED: 'Articulo_Aprobado',
    REJECTED: 'Articulo_Rechazado'
});

module.exports = { ReportTypeEnum, 
                   ActionResoluntionReportEnum, 
                   ArticleStatusEnum, 
                   ReportStatusEnum, 
                   NotificationTypeEnum };