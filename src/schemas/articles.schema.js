const yup = require('yup');

const articleSchema = yup.object().shape({
    title: yup
           .string()
           .required('El título es obligatorio')
           .min(3, 'El título es muy corto'),
    description: yup
           .string()
           .required('La descripción es obligatoria'),
    price: yup
           .number()
           .positive('El precio debe ser un número positivo')
           .required('El precio es obligatorio'),
    condition: yup
           .string()
           .oneOf(['Nuevo', 'Como nuevo', 'Buen estado', 'Aceptable'], 'Estado de conservación no válido')
           .required('La condición es obligatoria'),
    category_id: yup
           .number()
           .integer()
           .positive()
           .required('La categoría es obligatoria'),
    location: yup
        .string()
        .required('La ubicación es obligatoria'),
    photoUrls: yup
        .array()
        .of(yup.string())
        .optional()
});

const statusSchema = yup.object().shape({
    status: yup
        .string()
        .oneOf(['Borrador', 'Publicado', 'En revisión', 'Retirado', 'Vendido'], 'Ese estado del ciclo de vida no existe')
        .required('El estado es obligatorio')
});

module.exports = { articleSchema, statusSchema };