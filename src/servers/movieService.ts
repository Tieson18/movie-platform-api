import { pool } from "../config/db.js";
import { cache } from "../utils/cache.js";
import { TMDBService } from "./TMDBService.js";
import type { CreateMovieDTO, UpdateMovieDTO } from "../types/index.js";
import { dir } from "console";

export const MovieService = {
  async MovieService_list() {
    const cached = cache.get("movies");
    if (cached) return cached;

    const result = await pool.query("SELECT * FROM movies");

    cache.set("movies", result.rows);
    return { value: result.rows };
  },

  async MovieService_get(id: string) {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async MovieService_stats() {
    const result = await pool.query(`
    SELECT 
        COUNT(*)::int AS "totalMovies", 
        COALESCE(AVG(rating), 0)::float AS "averageRating"
      FROM movies
  `);
    return result.rows[0];
  },

  async MovieService_getDetails(id: string) {
    const movie = await this.MovieService_get(id);
    if (!movie) return null;

    // 🔥 Better approach: use search instead of ID
    const external = await TMDBService.searchMovies(movie.title);

    return {
      ...movie,
      externalData: external?.[0] || null,
    };
  },

  async MovieService_create(data: CreateMovieDTO) {
    const { title, director, release_year, genre, rating } = data;

    const result = await pool.query(
      "INSERT INTO movies (id, title, director, release_year, genre, rating) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *",
      [title, director, release_year, genre, rating],
    );

    cache.del("movies"); // 🔥 invalidate cache

    return result.rows[0];
  },

  async MovieService_update(id: string, data: UpdateMovieDTO) {
    if (!id) throw new Error("Invalid ID");

    const existing = await this.MovieService_get(id);
    if (!existing) return null;

    const updated = {
      title: data.title ?? existing.title,
      director: data.director ?? existing.director,
      release_year: data.release_year ?? existing.release_year,
      genre: data.genre ?? existing.genre,
      rating: data.rating ?? existing.rating,
    };

    try {
      const result = await pool.query(
        `UPDATE movies 
       SET title=$1, director=$2, genre=$3, rating=$4, release_year=$5 
       WHERE id=$6 
       RETURNING *`,
        [
          updated.title,
          updated.director,
          updated.genre,
          updated.rating,
          updated.release_year,
          id,
        ],
      );

      if (!result.rows[0]) {
        throw new Error("Update failed");
      }

      cache.del("movies");

      return result.rows[0];
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  },

  async MovieService_delete(id: string) {
    const result = await pool.query("DELETE FROM movies WHERE id=$1", [id]);

    cache.del("movies"); // 🔥 invalidate cache

    return (result.rowCount ?? 0) > 0;
  },
};
