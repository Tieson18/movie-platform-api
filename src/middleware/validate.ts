import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { ZodType } from "zod";
import { AppError } from "../utils/errors.js";

interface ValidationIssue {
  path: string;
  message: string;
  code: string;
}

const formatZodIssues = (error: ZodError): ValidationIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
    code: issue.code,
  }));

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: Request["body"];
        params?: Request["params"];
        query?: Request["query"];
      };

      if (validated.body !== undefined) {
        req.body = validated.body;
      }

      if (validated.params !== undefined) {
        req.params = validated.params;
      }

      if (validated.query !== undefined) {
        req.query = validated.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            400,
            "VALIDATION_ERROR",
            "Validation failed",
            formatZodIssues(error),
          ),
        );
        return;
      }

      next(error);
    }
  };
};
