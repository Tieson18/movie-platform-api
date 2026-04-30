import { MovieService } from "../servers/movieService.js";
import type { Movie } from "../types/index.js";

export const resolvers = {
  Query: {
    movies: async (): Promise<Movie[]> => {
      return MovieService.getAllMovies() as Promise<Movie[]>;
    },
    movie: async (_: unknown, { id }: { id: string }) => {
      return MovieService.getMovieById(id);
    },
  },

  Mutation: {
    createMovie: async (_: unknown, args: Movie) => {
      return MovieService.createMovie(args);
    },
  },
};
