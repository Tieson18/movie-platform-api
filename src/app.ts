import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { attachRequestUser } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";
import router from "./routes/index.js";

const app = express();
const spec = YAML.load("./openapi.yaml");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(attachRequestUser);

app.use("/", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
app.get("/", (_req, res) => {
  res
    .status(200)
    .send(
      "Hello! Welcome to the Movie Platform API. Use /movies for REST endpoints and /graphql for GraphQL.",
    );
});
app.use(errorHandler);

export default app;
