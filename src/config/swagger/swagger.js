// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");
const fs = require("fs");

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

//__dirname funciona en Vercel siempre que indiques el archivo en vercel.json
const yamlPath = path.join(__dirname, './swagger.yaml');
const swaggerSpec = yaml.parse(fs.readFileSync(yamlPath, 'utf8'));


const prodServer = {
  // Toma la URL dinámica del Preview si existe, si no, usa la de producción por defecto
  url: process.env.RENDER_EXTERNAL_URL || 'https://proyecto-final-node-js86.onrender.com',
  description: "Servidor de Producción  (Render)",
};

const localServer = {
  url: `http://localhost:${process.env.PORT || 3000}`,
  description: "Servidor de Desarrollo (Local)",
};

// Ordenamos el array según el entorno actual
// El que quede primero en el array será el que Swagger seleccione por defecto
swaggerSpec.servers = IS_PRODUCTION 
  ? [prodServer, localServer]  // Si estamos en producción: Producción primero, luego Local
  : [localServer, prodServer];

module.exports = swaggerSpec;