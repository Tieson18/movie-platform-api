import type { Movie } from "./movie.js";
import type { User } from "./user.js";

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: User;
  movie?: Movie;
}

export interface CreateReviewDTO {
  userId: string;
  movieId: string;
  rating: number;
  comment?: string | null;
}

export interface ReviewRow {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  comment: string | null;
  created_at: Date | string;
}
