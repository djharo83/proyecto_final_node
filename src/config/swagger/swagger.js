// src/config/swagger/swagger.js
const yaml = require('yamljs');
const path = require("path");
const fs = require("fs");

const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

//__dirname funciona en Vercel siempre que indiques el archivo en vercel.json
const yamlPath = path.join(__dirname, './swagger.yaml');
const swaggerSpec = yaml.parse(fs.readFileSync(yamlPath, 'utf8'));

// 1. Definimos los dos objetos de los servidores
const prodServer = {
  url: 'https://proyecto-final-node-five.vercel.app',
  description: "Servidor de Producción (Vercel)",
};

const localServer = {
  url: `http://localhost:${process.env.PORT || 3000}`,
  description: "Servidor de Desarrollo (Local)",
};

// Ordenamos el array según el entorno actual
// El que quede primero en el array será el que Swagger seleccione por defecto
swaggerSpec.servers = IS_VERCEL 
  ? [prodServer, localServer]  // Si estamos en Vercel: Producción primero, luego Local
  : [localServer, prodServer];

module.exports = swaggerSpec;