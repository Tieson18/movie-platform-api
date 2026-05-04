import { pool } from "../config/db.js";
import type { AddToWatchlistDTO, RequestUser, WatchlistItem, WatchlistRow } from "../types/index.js";
import { AppError } from "../utils/errors.js";
import { mapWatchlistRow } from "../utils/mappers.js";
import { MovieService } from "./movieService.js";
import { UserService } from "./UserService.js";

export const WatchlistService = {
  async add(data: AddToWatchlistDTO, requestUser?: RequestUser | null): Promise<WatchlistItem> {
    UserService.assertOwnership(requestUser ?? null, data.userId, { resourceName: "watchlist" });
    await UserService.requireById(data.userId);
    await MovieService.requireById(data.movieId);

    const existing = await pool.query<WatchlistRow>(
      `
        SELECT id, user_id, movie_id, created_at
        FROM watchlist
        WHERE user_id = $1 AND movie_id = $2
      `,
      [data.userId, data.movieId],
    );

    if (existing.rows[0]) {
      throw new AppError(409, "WATCHLIST_DUPLICATE", "Movie already exists in watchlist");
    }

    const result = await pool.query<WatchlistRow>(
      `
        INSERT INTO watchlist (id, user_id, movie_id)
        VALUES (gen_random_uuid(), $1, $2)
        RETURNING id, user_id, movie_id, created_at
      `,
      [data.userId, data.movieId],
    );

    if (!result.rows[0]) {
      throw new AppError(500, "DATABASE_ERROR", "Failed to add movie to watchlist");
    }

    return mapWatchlistRow(result.rows[0]);
  },

  async listByUserId(userId: string, requestUser?: RequestUser | null): Promise<WatchlistItem[]> {
    await UserService.requireById(userId);
    UserService.assertOwnership(requestUser ?? null, userId, { resourceName: "watchlist" });

    const result = await pool.query<WatchlistRow>(
      `
        SELECT id, user_id, movie_id, created_at
        FROM watchlist
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    return result.rows.map(mapWatchlistRow);
  },

  async getById(id: string): Promise<WatchlistItem | null> {
    const result = await pool.query<WatchlistRow>(
      `
        SELECT id, user_id, movie_id, created_at
        FROM watchlist
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? mapWatchlistRow(result.rows[0]) : null;
  },

  async remove(id: string, requestUser?: RequestUser | null): Promise<void> {
    const item = await this.getById(id);

    if (!item) {
      throw new AppError(404, "WATCHLIST_NOT_FOUND", "Watchlist item not found");
    }

    UserService.assertOwnership(requestUser ?? null, item.userId, { resourceName: "watchlist item" });

    await pool.query("DELETE FROM watchlist WHERE id = $1", [id]);
  },
};
