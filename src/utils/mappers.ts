import type {
  Movie,
  MovieRow,
  Review,
  ReviewRow,
  User,
  UserRow,
  WatchlistItem,
  WatchlistRow,
} from "../types/index.js";

export const mapMovieRow = (row: MovieRow): Movie => ({
  id: row.id,
  title: row.title,
  director: row.director,
  releaseYear: row.release_year,
  genre: row.genre,
  rating: Number(row.rating),
});

export const mapUserRow = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  createdAt: new Date(row.created_at).toISOString(),
});

export const mapReviewRow = (row: ReviewRow): Review => ({
  id: row.id,
  userId: row.user_id,
  movieId: row.movie_id,
  rating: Number(row.rating),
  comment: row.comment,
  createdAt: new Date(row.created_at).toISOString(),
});

export const mapWatchlistRow = (row: WatchlistRow): WatchlistItem => ({
  id: row.id,
  userId: row.user_id,
  movieId: row.movie_id,
  createdAt: new Date(row.created_at).toISOString(),
});
