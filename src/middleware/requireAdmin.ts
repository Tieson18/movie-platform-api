import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
  }

  if (req.user.role !== "admin") {
    return next(new AppError(403, "FORBIDDEN", "Admin access required"));
  }

  return next();
};
