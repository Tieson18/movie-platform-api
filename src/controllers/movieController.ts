import type { Request, Response } from "express";
import { MovieService } from "../servers/movieService.js";
import type { CreateMovieDTO } from "../types/index.js";

export const MovieController = {
  async getAll(req: Request, res: Response) {
    try {
      const movies = await MovieService.MovieService_list();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const movie = await MovieService.MovieService_get(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  },

  async getWithDetails(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const movie = await MovieService.MovieService_getDetails(id);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movie details" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const movie = await MovieService.MovieService_create(req.body);
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to create movie" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const movie = await MovieService.MovieService_update(id, req.body);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to update movie" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const deleted = await MovieService.MovieService_delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete movie" });
    }
  },
};
