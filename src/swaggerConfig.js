const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation for iTicket Project",
      version: "1.0.0",
      description: "Documentation for the backend APIs",
    },
    servers: [
      {
        url: "https://abdulaziz-test.onrender.com", // Твой продакшн-домен
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "routes/**/*.js")], // Подключает все файлы API в routes/
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
