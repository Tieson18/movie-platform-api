export type Genre = "Action" | "Drama" | "Comedy" | "Sci-Fi" | string;

export interface Movie {
  id: string;
  title: string;
  director: string;
  releaseYear: number | null;
  genre: Genre;
  rating: number;
}

export interface MovieWithDetails extends Movie {
  externalData: TMDBMovie | null;
}

export interface CreateMovieDTO {
  title: string;
  director: string;
  releaseYear: number | null;
  genre: Genre;
  rating: number;
}

export interface UpdateMovieDTO {
  title?: string;
  director?: string;
  releaseYear?: number | null;
  genre?: Genre;
  rating?: number;
}

export interface MovieStats {
  totalMovies: number;
  averageRating: number;
}

export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieRow {
  id: string;
  title: string;
  director: string;
  release_year: number | null;
  genre: string;
  rating: number;
}
