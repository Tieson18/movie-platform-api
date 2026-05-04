import { Router } from "express";
import { ReviewController } from "../controllers/reviewController.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import { IdParamsSchema } from "../validations/common.validation.js";
import { CreateReviewSchema } from "../validations/review.validation.js";

const reviewRouter = Router();

reviewRouter.post("/reviews", auth, requireRole("user", "admin"), validate(CreateReviewSchema), ReviewController.create);
reviewRouter.get("/movies/:id/reviews", validate(IdParamsSchema), ReviewController.getByMovie);

export default reviewRouter;
