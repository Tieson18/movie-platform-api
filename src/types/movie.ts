export type Genre = "Action" | "Drama" | "Comedy" | "Sci-Fi";
export interface Movie {
  id: string;
  title: string;
  director: string;
  release_year: number;
  genre: Genre;
  rating: number;
}

export interface CreateMovieDTO {
  title: string;
  director: string;
  release_year: number;
  genre: Genre;
  rating: number;
}

export interface UpdateMovieDTO {
  title?: string;
  director?: string;
  release_year?: number;
  genre?: Genre;
  rating?: number;
}

export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  softcore: boolean;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
