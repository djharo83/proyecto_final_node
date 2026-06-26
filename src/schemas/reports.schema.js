const yup = require('yup');

const reportSchema = yup.object().shape({
    type: yup.string()
        .oneOf(['Articulo', 'Usuario'], "El tipo debe ser 'Articulo' o 'Usuario'")
        .required('El tipo de reporte es obligatorio'),
    reason: yup.string()
        .required('El motivo del reporte es obligatorio'),
    article_id: yup.number().integer().positive().nullable().optional(),
    reported_user_id: yup.number().integer().positive().nullable().optional()
});

module.exports = { reportSchema };