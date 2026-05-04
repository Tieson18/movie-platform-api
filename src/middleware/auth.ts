import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

const extractBearerToken = (request: Request): string | null => {
  const authorization = request.header("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid authorization header");
  }

  return token.trim();
};

export const attachRequestUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      delete req.user;
      return next();
    }

    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};
