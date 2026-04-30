import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Catalog API",
      version: "1.0.0",
      description: "REST API for managing movies with TMDB integration",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // where your route docs live
};

export const swaggerSpec = swaggerJsdoc(options);
