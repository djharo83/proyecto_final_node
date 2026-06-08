// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");

// 1. Detectamos si estamos en Vercel o en local
const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// 2. Definimos dinámicamente la URL del servidor
const SERVER_URL = IS_VERCEL 
  ? `https://${process.env.VERCEL_URL || 'proyecto-final-node-five.vercel.app'}` 
  : `http://localhost:${process.env.PORT || 3000}`;

// 3. ¡SOLUCIÓN!: Usamos __dirname para ambos entornos ya que están en la misma carpeta
const yamlPath = path.join(__dirname, './swagger.yaml');

// 4. Cargamos tu archivo YAML
const swaggerSpec = yaml.load(yamlPath);

// 5. Sobrescribimos dinámicamente los servidores
swaggerSpec.servers = [
  {
    url: SERVER_URL,
    description: IS_VERCEL ? "Servidor de Producción (Vercel)" : "Servidor de Desarrollo (Local)",
  },
];

module.exports = swaggerSpec;