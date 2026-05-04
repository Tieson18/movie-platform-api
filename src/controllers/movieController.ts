import type { NextFunction, Request, Response } from "express";
import { MovieService } from "../services/movieService.js";
import { AppError } from "../utils/errors.js";

export const MovieController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const movies = await MovieService.list();
      res.status(200).json({ value: movies });
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const movie = await MovieService.requireById(id);
      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  },

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await MovieService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const movie = await MovieService.getDetails(id);

      if (!movie) {
        throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
      }

      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const movie = await MovieService.create(req.body);
      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const movie = await MovieService.update(id, req.body);
      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await MovieService.delete(id);
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
