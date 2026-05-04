import jwt from "jsonwebtoken";
import type { AuthenticatedRequestUser, JwtPayload } from "../types/index.js";
import { AppError } from "./errors.js";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(500, "CONFIGURATION_ERROR", "JWT_SECRET is not configured");
  }

  return secret;
};

export const signToken = (payload: AuthenticatedRequestUser): string =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.id !== "string" ||
    (decoded.role !== "admin" && decoded.role !== "user")
  ) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid authentication token");
  }

  return {
    id: decoded.id,
    role: decoded.role,
  };
};
