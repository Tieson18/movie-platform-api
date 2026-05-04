import { Router } from "express";
import authRouter from "./authRoutes.js";
import movieRouter from "./movieRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import userRouter from "./userRoutes.js";
import watchlistRouter from "./watchlistRoutes.js";

const router = Router();

router.use(authRouter);
router.use(movieRouter);
router.use(userRouter);
router.use(reviewRouter);
router.use(watchlistRouter);

export default router;
