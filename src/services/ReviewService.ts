import { pool } from "../config/db.js";
import type { CreateReviewDTO, RequestUser, Review, ReviewRow } from "../types/index.js";
import { AppError } from "../utils/errors.js";
import { mapReviewRow } from "../utils/mappers.js";
import { MovieService } from "./movieService.js";
import { UserService } from "./UserService.js";

export const ReviewService = {
  async create(data: CreateReviewDTO, requestUser?: RequestUser | null): Promise<Review> {
    UserService.assertOwnership(requestUser ?? null, data.userId, { resourceName: "review" });
    await UserService.requireById(data.userId);
    await MovieService.requireById(data.movieId);

    const result = await pool.query<ReviewRow>(
      `
        INSERT INTO reviews (id, user_id, movie_id, rating, comment)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        RETURNING id, user_id, movie_id, rating, comment, created_at
      `,
      [data.userId, data.movieId, data.rating, data.comment?.trim() || null],
    );

    if (!result.rows[0]) {
      throw new AppError(500, "DATABASE_ERROR", "Failed to create review");
    }

    return mapReviewRow(result.rows[0]);
  },

  async listByMovieId(movieId: string): Promise<Review[]> {
    await MovieService.requireById(movieId);

    const result = await pool.query<ReviewRow>(
      `
        SELECT id, user_id, movie_id, rating, comment, created_at
        FROM reviews
        WHERE movie_id = $1
        ORDER BY created_at DESC
      `,
      [movieId],
    );

    return result.rows.map(mapReviewRow);
  },

  async listByUserId(userId: string, requestUser?: RequestUser | null): Promise<Review[]> {
    await UserService.requireById(userId);
    UserService.assertOwnership(requestUser ?? null, userId, { resourceName: "reviews" });

    const result = await pool.query<ReviewRow>(
      `
        SELECT id, user_id, movie_id, rating, comment, created_at
        FROM reviews
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    return result.rows.map(mapReviewRow);
  },
};
