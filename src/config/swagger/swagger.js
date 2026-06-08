// config/swagger.js
const yaml = require('yamljs');
const path = require("path");

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0", // Versión de OpenAPI que usaremos
    info: {
      title: "API Node.js",
      version: "1.0.0",
      description: "Documentación de la API de Node.js con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // Pon aquí el puerto que use tu app
        description: "Servidor de Desarrollo",
      },
    ],
  },
  // Rutas donde Swagger buscará los comentarios para documentar
  //apis: [path.join(__dirname, '../routes/*.js')],
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = yaml.load(path.join(__dirname, './swagger.yaml'));
console.log("Swagger paths:", swaggerSpec.paths);

module.exports = swaggerSpec;
