// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");

// 1. Detectamos si estamos en Vercel o en local
const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// 2. Definimos dinámicamente la URL del servidor
const SERVER_URL = IS_VERCEL 
  ? `https://${process.env.VERCEL_URL || 'proyecto-final-node-five.vercel.app'}` 
  : `http://localhost:${process.env.PORT || 3000}`;

// 3. Resolvemos la ruta del archivo según el entorno real de tu árbol
const yamlPath = IS_VERCEL
  ? path.join(process.cwd(), 'src/config/swagger/swagger.yaml') // En Vercel empieza desde la raíz, entra a src/config/...
  : path.join(__dirname, './swagger.yaml');                     // En local lee la misma carpeta

// 4. Cargamos tu archivo YAML original intacto
const swaggerSpec = yaml.load(yamlPath);

// 5. Sobrescribimos dinámicamente los servidores para ambos entornos
swaggerSpec.servers = [
  {
    url: SERVER_URL,
    description: IS_VERCEL ? "Servidor de Producción (Vercel)" : "Servidor de Desarrollo (Local)",
  },
];

module.exports = swaggerSpec;