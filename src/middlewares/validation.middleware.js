const validateSchema = (schema) => {
    return async (req, res, next) => {
        try { 
            // abortEarly: false (devuelve todos los errores juntos)
            // stripUnknown: true (limpia campos extraños que se intenten colar)
            const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
            
            req.body = data; 
            next();
        } catch (error) {
            res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
    }
}

module.exports = { validateSchema }