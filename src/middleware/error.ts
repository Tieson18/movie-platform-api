import type { NextFunction, Request, Response } from "express";
import { isAppError } from "../utils/errors.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isAppError(err)) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  console.error(err);
  return res.status(500).json({ error: message });
};
