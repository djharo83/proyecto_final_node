// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");

const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const SERVER_URL = IS_VERCEL 
  ? `https://${process.env.VERCEL_URL || 'proyecto-final-node-five.vercel.app'}` 
  : `http://localhost:${process.env.PORT || 3000}`;

// __dirname funciona en Vercel siempre que indiques el archivo en vercel.json
const yamlPath = path.join(__dirname, './swagger.yaml');
const swaggerSpec = yaml.load(yamlPath);

swaggerSpec.servers = [
  {
    url: SERVER_URL,
    description: IS_VERCEL ? "Servidor de Producción (Vercel)" : "Servidor de Desarrollo (Local)",
  },
];

module.exports = swaggerSpec;