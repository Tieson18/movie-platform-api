import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
  }

  return next();
};
