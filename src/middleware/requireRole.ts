import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../types/index.js";
import { AppError } from "../utils/errors.js";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, "UNAUTHORIZED", "Authentication required");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(403, "FORBIDDEN", "Insufficient permissions");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
