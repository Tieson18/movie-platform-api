import type { NextFunction, Request, Response } from "express";
import { WatchlistService } from "../services/WatchlistService.js";

export const WatchlistController = {
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await WatchlistService.add(req.body, req.user ?? null);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const items = await WatchlistService.listByUserId(id, req.user ?? null);
      res.status(200).json({ value: items });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await WatchlistService.remove(id, req.user ?? null);
      res.status(200).json({ message: "Watchlist item removed successfully" });
    } catch (error) {
      next(error);
    }
  },
};
