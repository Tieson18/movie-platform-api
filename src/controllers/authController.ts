import type { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService.js";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
