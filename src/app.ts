import express from "express";
import cors from "cors";
import router from "./routes/movieRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// REST routes
app.use("/", router);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Hello! Welcome to the Movie Platform API. Use /api for REST endpoints and /graphql for GraphQL.",
    );
});
export default app;
