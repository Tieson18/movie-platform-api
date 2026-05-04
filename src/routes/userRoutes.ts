import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { WatchlistController } from "../controllers/watchlistController.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import { IdParamsSchema } from "../validations/common.validation.js";

const userRouter = Router();

userRouter.get("/users", auth, requireRole("admin"), UserController.list);
userRouter.get("/users/:id", auth, requireRole("user", "admin"), validate(IdParamsSchema), UserController.getProfile);
userRouter.get("/users/:id/watchlist", auth, requireRole("user", "admin"), validate(IdParamsSchema), WatchlistController.getByUser);

export default userRouter;
