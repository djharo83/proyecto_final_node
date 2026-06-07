// config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0", // Versión de OpenAPI que usaremos
    info: {
      title: "Mi API en Node.js",
      version: "1.0.0",
      description: "Documentación de las rutas de Categorías y Favoritos",
    },
    servers: [
      {
        url: "http://localhost:3000", // Pon aquí el puerto que use tu app
        description: "Servidor de Desarrollo",
      },
    ],
  },
  // Rutas donde Swagger buscará los comentarios para documentar
  apis: [path.join(__dirname, "..", "routes", "**", "*.js").replace(/\\/g, "/")],
};

const swaggerSpec = swaggerJSDoc(options);
console.log("Swagger paths:", swaggerSpec.paths);

module.exports = swaggerSpec;
