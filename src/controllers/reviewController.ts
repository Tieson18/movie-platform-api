import type { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService.js";

export const ReviewController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.create(req.body, req.user ?? null);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  },

  async getByMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const reviews = await ReviewService.listByMovieId(id);
      res.status(200).json({ value: reviews });
    } catch (error) {
      next(error);
    }
  },
};
