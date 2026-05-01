import { pool } from "../config/db.js";
import { cache } from "../utils/cache.js";
import { TMDBService } from "./TMDBService.js";
import type { CreateMovieDTO, UpdateMovieDTO } from "../types/index.js";

export const MovieService = {
  async MovieService_list() {
    const cached = cache.get("movies");
    if (cached) return cached;

    const result = await pool.query("SELECT * FROM movies");

    cache.set("movies", result.rows);
    return result.rows;
  },

  async MovieService_get(id: string) {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async MovieService_stats() {
    const result = await pool.query(`
      SELECT genre, COUNT(*) AS count, AVG(rating) AS avg_rating
      FROM movies
      GROUP BY genre
    `);
    return result.rows;
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
    const existing = await this.MovieService_get(id);
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

  async MovieService_delete(id: string) {
    const result = await pool.query("DELETE FROM movies WHERE id=$1", [id]);

    cache.del("movies"); // 🔥 invalidate cache

    return (result.rowCount ?? 0) > 0;
  },
};
