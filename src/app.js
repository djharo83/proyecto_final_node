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

// Define las URLs del CSS y JS oficiales de Swagger desde una CDN
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js";
// --- NUEVA RUTA PARA SWAGGER ADAPTADA A VERCEL---
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
    '/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, {
        customCssUrl: CSS_URL,
        customJs: JS_URL,
        swaggerOptions: {
            layout: "BaseLayout"
        }
    })
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
