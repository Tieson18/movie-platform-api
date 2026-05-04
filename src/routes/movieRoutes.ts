import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import { IdParamsSchema } from "../validations/common.validation.js";
import { CreateMovieSchema, UpdateMovieSchema } from "../validations/movie.validation.js";

const router = Router();

router.get("/movies", MovieController.getAll);
router.post("/movies", requireAuth, requireAdmin, validate(CreateMovieSchema), MovieController.create);
router.get("/movies/stats", MovieController.getStats);
router.get("/movies/:id/details", validate(IdParamsSchema), MovieController.getDetails);
router.get("/movies/:id", validate(IdParamsSchema), MovieController.getOne);
router.patch("/movies/:id", requireAuth, requireAdmin, validate(IdParamsSchema.and(UpdateMovieSchema)), MovieController.update);
router.put("/movies/:id", requireAuth, requireAdmin, validate(IdParamsSchema.and(CreateMovieSchema)), MovieController.update);
router.delete("/movies/:id", requireAuth, requireAdmin, validate(IdParamsSchema), MovieController.remove);

export default router;
