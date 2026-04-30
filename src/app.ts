import express from "express";
import cors from "cors";
import router from "./routes/movieRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  },
);

// REST routes
app.use("/api", router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Hello! Welcome to the Movie Platform API. Use /api for REST endpoints and /graphql for GraphQL.",
    );
});
export default app;
