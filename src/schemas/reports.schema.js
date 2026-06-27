const yup = require('yup');

const { ReportTypeEnum, ActionResoluntionReportEnum } = require("../constants/enums.js"); 

const reportSchema = yup.object().shape({
    type: yup.string()
        .oneOf([ReportTypeEnum.ARTICLE, ReportTypeEnum.USER], `El tipo debe ser ${ReportTypeEnum.ARTICLE} o ${ReportTypeEnum.USER}`)
        .required('El tipo de reporte es obligatorio'),
    reason: yup.string()
        .required('El motivo del reporte es obligatorio'),
    article_id: yup.number().integer().positive().nullable().optional(),
    reported_user_id: yup.number().integer().positive().nullable().optional()
});

const updateReportSchema = yup.object().shape({
    action: yup.string()
        .oneOf([ActionResoluntionReportEnum.ACCEPT, ActionResoluntionReportEnum.REJECT], `La acción para la resolución del reporte debe ser ${ActionResoluntionReportEnum.ACCEPT} o ${ActionResoluntionReportEnum.REJECT}`)
        .required('La acción para la resolución del reporte es obligatoria'),
    moderator_note: yup.string()
        .required('La nota del moderador para la resolución del reporte es obligatoria')
});

module.exports = { reportSchema, updateReportSchema };