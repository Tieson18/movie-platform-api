const swaggerSpec = {
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
};

export default swaggerSpec;
