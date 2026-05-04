import { Router } from "express";
import { WatchlistController } from "../controllers/watchlistController.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import { IdParamsSchema } from "../validations/common.validation.js";
import { AddToWatchlistSchema } from "../validations/watchlist.validation.js";

const watchlistRouter = Router();

watchlistRouter.post("/watchlist", auth, requireRole("user", "admin"), validate(AddToWatchlistSchema), WatchlistController.add);
watchlistRouter.delete("/watchlist/:id", auth, requireRole("user", "admin"), validate(IdParamsSchema), WatchlistController.remove);

export default watchlistRouter;
