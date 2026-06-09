// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");
const fs = require("fs");

const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Si es Vercel, forzamos tu dominio de producción definitivo
const SERVER_URL = IS_VERCEL 
  ? 'https://proyecto-final-node-five.vercel.app' 
  : `http://localhost:${process.env.PORT || 3000}`;

//__dirname funciona en Vercel siempre que indiques el archivo en vercel.json
const yamlPath = path.join(__dirname, './swagger.yaml');
const swaggerSpec = yaml.parse(fs.readFileSync(yamlPath, 'utf8'));

swaggerSpec.servers = [
  {
    url: 'https://proyecto-final-node-five.vercel.app',
    description: "Servidor de Producción (Vercel)",
  },
  {
    url: `http://localhost:${process.env.PORT || 3000}`,
    description: "Servidor de Desarrollo (Local)",
  }
];

module.exports = swaggerSpec;