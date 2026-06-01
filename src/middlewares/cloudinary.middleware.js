const cloudinary = require('../config/cloudinary');

// Sube los buffers a Cloudinary e inyecta las URLs en req.body.photoUrls para que el controlador las reciba como si fueran texto normal

// Función helper interna
const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'wallapop_clone_articles' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

// Middleware para subir imagenes a Cloudinary
const uploadToCloudinary = async (req, res, next) => {
    try {
        // Si no hay archivos, pasamos al siguiente middleware/controlador
        if (!req.files || req.files.length === 0) {
            req.body.photoUrls = []; // Inicializamos vacío para que no de error
            return next();
        }

        // Subimos todas las imágenes en paralelo
        const uploadPromises = req.files.map(file => uploadBufferToCloudinary(file.buffer));
        const photoUrls = await Promise.all(uploadPromises);
        
        // ¡MAGIA!: Inyectamos las URLs resultantes en el req.body 
        // para que el controlador las reciba como si fueran texto normal
        req.body.photoUrls = photoUrls;
        
        next(); // Todo bien, pasamos al controlador
    } catch (error) {
        res.status(500).json({ message: 'Error subiendo imágenes a Cloudinary', error: error.message });
    }
};

module.exports = uploadToCloudinary;