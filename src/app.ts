import express from "express";
import cors from "cors";
import router from "./routes/movieRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/error.js";
import YAML from "yamljs";
import path from "path/win32";

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(errorHandler);

const specPath = path.join(process.cwd(), "openapi.yaml");

const spec = YAML.load(specPath);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
console.log("✓ Swagger UI mounted on /docs");

// REST routes
app.use("/api", router);

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Hello! Welcome to the Movie Platform API. Use /api for REST endpoints and /graphql for GraphQL.",
    );
});
export default app;
