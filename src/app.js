// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger/swagger');

const app = express();
app.use(cors());

// Ampliamos limite de imagenes enviadas en el body a 10mb para que no pete al subir fotos en Base64
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Route configuration
// Ex.
app.use('/api', require('./routes/api'));

// Detectamos el entorno
const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Creamos un objeto de opciones vacío para local
let swaggerOptions = {};

// Si estamos en Vercel, aplicamos el parche de las CDNs para que no se rompa en producción
if (IS_VERCEL) {
    swaggerOptions = {
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
        swaggerOptions: {
            validatorUrl: null
        }
    };
}

// Inicializamos Swagger pasándole las opciones dinámicas
app.use(
    '/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, swaggerOptions)
);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
    // Investigar con libreria winston manejo de logs

});

module.exports = app;
