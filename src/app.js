// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger/swagger');

const app = express();

// Lista de orígenes permitidos para CORS
const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:4000',
    'http://localhost:3000',
    'https://proyecto-final-node-js86.onrender.com',
    'https://recicleapp.vercel.app'
];                                               

const corsOptions = {
    origin: function (dominioEmisor, callback) {
        // Permitir peticiones sin origen (como Postman)
        if (!dominioEmisor) return callback(null, true);
        
        if (allowedOrigins.indexOf(dominioEmisor) !== -1) {
            callback(null, true);
        } else {
            // Al pasar (null, false), CORS rechaza la petición limpiamente 
            // sin generar un error 500 en tu servidor.
            callback(null, false);
        }
    },
    
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Ampliamos limite de imagenes enviadas en el body a 10mb para que no pete al subir fotos en Base64
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Route configuration
// Ex.
app.use('/api', require('./routes/api'));

// --- CONFIGURACIÓN DE SWAGGER SIMPLIFICADA PARA RENDER ---
const swaggerOptions = {
    explorer: true
};

// La ruta principal de la documentación se configura directamente con el objeto 'swaggerSpec'
app.use(
    '/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, swaggerOptions)
);
// --- FIN CONFIGURACIÓN SWAGGER ---

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found"
    });
});

// 500 Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
    // Investigar con libreria winston manejo de logs

});

module.exports = {app, allowedOrigins };
