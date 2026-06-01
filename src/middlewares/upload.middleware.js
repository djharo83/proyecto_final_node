const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith('image/')
            ? cb(null, true)
            : cb(new Error('No es una imagen válida'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máx por foto
});

module.exports = upload;