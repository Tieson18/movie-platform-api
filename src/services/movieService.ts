import { pool } from "../config/db.js";
import type {
  CreateMovieDTO,
  Movie,
  MovieRow,
  MovieStats,
  MovieWithDetails,
  UpdateMovieDTO,
} from "../types/index.js";
import { TMDBService } from "./TMDBService.js";
import { CACHE_KEYS, cache, invalidateMovieCache } from "../utils/cache.js";
import { AppError } from "../utils/errors.js";
import { mapMovieRow } from "../utils/mappers.js";

const toMovie = (row: MovieRow): Movie => mapMovieRow(row);
const requireRow = <T>(row: T | undefined, message: string): T => {
  if (!row) {
    throw new AppError(500, "DATABASE_ERROR", message);
  }

  return row;
};

export const MovieService = {
  async list(): Promise<MovieWithDetails[]> {
    const cached = cache.get<MovieWithDetails[]>(CACHE_KEYS.movies);
    if (cached) {
      return cached;
    }

    const result = await pool.query<MovieRow>(
      "SELECT id, title, director, release_year, genre, rating FROM movies ORDER BY title ASC",
    );
    const movies = result.rows.map(toMovie);

    const TMDBMovies = await Promise.all(
      movies.map(async (movie) => {
        const external = await TMDBService.searchMovies(movie.title);
        return {
          ...movie,
          externalData: external[0] ?? null,
        };
      }),
    );
    cache.set(CACHE_KEYS.movies, TMDBMovies);
    return TMDBMovies;
  },

  async getById(id: string): Promise<Movie | null> {
    const result = await pool.query<MovieRow>(
      "SELECT id, title, director, release_year, genre, rating FROM movies WHERE id = $1",
      [id],
    );

    return result.rows[0] ? toMovie(result.rows[0]) : null;
  },

  async requireById(id: string): Promise<Movie> {
    const movie = await this.getById(id);

    if (!movie) {
      throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
    }

    return movie;
  },

  async getStats(): Promise<MovieStats> {
    const cached = cache.get<MovieStats>(CACHE_KEYS.movieStats);
    if (cached) {
      return cached;
    }

    const result = await pool.query<{
      totalMovies: number;
      averageRating: number;
    }>(`
      SELECT
        COUNT(*)::int AS "totalMovies",
        COALESCE(AVG(rating), 0)::float AS "averageRating"
      FROM movies
    `);

    const stats = {
      totalMovies: Number(result.rows[0]?.totalMovies ?? 0),
      averageRating: Number(result.rows[0]?.averageRating ?? 0),
    };

    cache.set(CACHE_KEYS.movieStats, stats);
    return stats;
  },

  async getDetails(id: string): Promise<MovieWithDetails | null> {
    const movie = await this.getById(id);
    if (!movie) {
      return null;
    }

    const external = await TMDBService.searchMovies(movie.title);

    return {
      ...movie,
      externalData: external[0] ?? null,
    };
  },

  async create(data: CreateMovieDTO): Promise<Movie> {
    const result = await pool.query<MovieRow>(
      `
        INSERT INTO movies (id, title, director, release_year, genre, rating)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING id, title, director, release_year, genre, rating
      `,
      [
        data.title,
        data.director,
        data.releaseYear ?? null,
        data.genre,
        data.rating,
      ],
    );

    invalidateMovieCache();
    return toMovie(requireRow(result.rows[0], "Failed to create movie"));
  },

  async update(id: string, data: UpdateMovieDTO): Promise<Movie> {
    const existing = await this.requireById(id);

    const nextTitle = data.title ?? existing.title;
    const nextDirector = data.director ?? existing.director;
    const nextGenre = data.genre ?? existing.genre;
    const nextRating = data.rating ?? existing.rating;
    const nextReleaseYear =
      data.releaseYear !== undefined ? data.releaseYear : existing.releaseYear;

    const result = await pool.query<MovieRow>(
      `
        UPDATE movies
        SET title = $1, director = $2, release_year = $3, genre = $4, rating = $5
        WHERE id = $6
        RETURNING id, title, director, release_year, genre, rating
      `,
      [nextTitle, nextDirector, nextReleaseYear, nextGenre, nextRating, id],
    );

    invalidateMovieCache();
    return toMovie(requireRow(result.rows[0], "Failed to update movie"));
  },

  async delete(id: string): Promise<void> {
    const result = await pool.query("DELETE FROM movies WHERE id = $1", [id]);

    if (!result.rowCount) {
      throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
    }

    invalidateMovieCache();
  },
};
