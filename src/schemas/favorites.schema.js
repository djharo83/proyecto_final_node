const yup = require('yup');

const favoritesSchema = yup.object().shape({
    user_id: yup
        .number('El ID del usuario debe ser un número válido').strict()
        .typeError('El ID del usuario debe ser un número estricto, no se permite texto')
        .integer('El ID del usuario debe ser un número entero')
        .required('El ID del usuario es obligatorio'),
    
    article_id: yup
        .number('El ID del artículo debe ser un número válido').strict()
        .typeError('El ID del artículo debe ser un número estricto, no se permite texto')
        .integer('El ID del artículo debe ser un número entero')
        .required('El ID del artículo es obligatorio')
});

module.exports = { favoritesSchema };