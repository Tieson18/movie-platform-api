export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  release_year: number;
}

export interface CreateMovieDTO {
  title: string;
  genre: string;
  rating: number;
  release_year: number;
}

export interface UpdateMovieDTO {
  title?: string;
  genre?: string;
  rating?: number;
  release_year?: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}
