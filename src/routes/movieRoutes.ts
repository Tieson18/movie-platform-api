import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";

const router = Router();

router.get("/movies", MovieController.getAll);
router.post("/movies", MovieController.create);
router.get("/movies/stats", MovieController.stats);
router.get("/movies/:id/details", MovieController.getWithDetails);
router.get("/movies/:id", MovieController.getOne);
router.patch("/movies/:id", MovieController.update);
router.delete("/movies/:id", MovieController.delete);

export default router;
