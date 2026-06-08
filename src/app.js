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

//Detectamos el entorno para configurar Swagger de forma adecuada (en Vercel no podemos servir archivos estáticos, así que le decimos a Swagger que cargue los suyos desde CDN)
const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        url: '/api-docs/swagger.json' // Le da una ruta fija al JSON para que no use scripts internos rotos
    }
};

if (IS_VERCEL) {
    swaggerOptions = {
        ...swaggerOptions,
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js"
    };
}

// Endpoint para servir el JSON que necesita el explorador de Swagger
app.get('/api-docs/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

// La ruta principal que ahora será infalible
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
