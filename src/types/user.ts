import type { Review } from "./review.js";
import type { WatchlistItem } from "./watchlist.js";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  reviews?: Review[];
  watchlist?: WatchlistItem[];
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date | string;
}
