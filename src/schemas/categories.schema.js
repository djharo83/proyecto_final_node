const yup = require('yup');

const categoriesSchema = yup.object().shape({
    
       name: yup.string().required('El nombre de la categoría es obligatorio'),
       
       slug: yup.string().required('El slug de la categoría es obligatorio')
});

module.exports = { categoriesSchema };