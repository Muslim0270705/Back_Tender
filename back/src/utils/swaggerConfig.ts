import swaggerJsdoc from "swagger-jsdoc";
// import Config from "./config";

// const SWAGGER_URL = Config.SWAGGER_URL;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "API documentation for your service",
    },
    servers: [
      {
        url: "http://195.49.215.146:3010",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
