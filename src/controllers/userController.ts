import type { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService.js";

export const UserController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await UserService.requireById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.list();
      res.status(200).json({ value: users });
    } catch (error) {
      next(error);
    }
  },
};
