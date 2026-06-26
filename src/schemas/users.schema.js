const yup = require('yup');

const registerSchema = yup.object().shape({
    username: yup.string()
        .required('El nombre de usuario es obligatorio')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: yup.string()
        .email('El email tiene un formato incorrecto')
        .required('El email es obligatorio'),
    password: yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria')
});

const loginSchema = yup.object().shape({
    email: yup.string()
        .email('El email tiene un formato incorrecto')
        .required('El email es obligatorio'),
    password: yup.string()
        .required('La contraseña es obligatoria')
});

const editProfileSchema = yup.object().shape({
    username: yup.string().optional(),
    email: yup.string().email('El email tiene un formato incorrecto').optional(),
    location: yup.string().optional(),
    avatar_url: yup.string().nullable().optional()
});

module.exports = { registerSchema, loginSchema, editProfileSchema };