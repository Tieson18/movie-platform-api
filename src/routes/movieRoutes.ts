import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";

const router = Router();

router.get("/movies", MovieController.getAll);
router.get("/movies/:id", MovieController.getOne);
router.post("/movies", MovieController.create);
router.put("/movies/:id", MovieController.update);
router.delete("/movies/:id", MovieController.delete);
router.get("/movies/:id/details", MovieController.getWithDetails);

export default router;
