import { pool } from "../config/db.js";
import { cache } from "../utils/cache.js";
import { TMDBService } from "./TMDBService.js";
import type { CreateMovieDTO, UpdateMovieDTO } from "../types/index.js";

export const MovieService = {
  async getAllMovies() {
    const cached = cache.get("movies");
    if (cached) return cached;

    const result = await pool.query("SELECT * FROM movies");

    cache.set("movies", result.rows);
    return result.rows;
  },

  async getMovieById(id: string) {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async getMovieWithDetails(id: string) {
    const movie = await this.getMovieById(id);
    if (!movie) return null;

    // 🔥 Better approach: use search instead of ID
    const external = await TMDBService.searchMovies(movie.title);

    return {
      ...movie,
      externalData: external?.[0] || null,
    };
  },

  async createMovie(data: CreateMovieDTO) {
    const { title, genre, rating, release_year } = data;

    const result = await pool.query(
      "INSERT INTO movies (title, genre, rating, release_year) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, genre, rating, release_year],
    );

    cache.del("movies"); // 🔥 invalidate cache

    return result.rows[0];
  },

  async updateMovie(id: number, data: UpdateMovieDTO) {
    const existing = await this.getMovieById(id);
    if (!existing) return null;

    const updated = {
      title: data.title ?? existing.title,
      genre: data.genre ?? existing.genre,
      rating: data.rating ?? existing.rating,
      release_year: data.release_year ?? existing.release_year,
    };

    const result = await pool.query(
      "UPDATE movies SET title=$1, genre=$2, rating=$3, release_year=$4 WHERE id=$5 RETURNING *",
      [updated.title, updated.genre, updated.rating, updated.release_year, id],
    );

    cache.del("movies"); // 🔥 invalidate cache

    return result.rows[0];
  },

  async deleteMovie(id: number) {
    const result = await pool.query("DELETE FROM movies WHERE id=$1", [id]);

    cache.del("movies"); // 🔥 invalidate cache

    return (result.rowCount ?? 0) > 0;
  },
};
