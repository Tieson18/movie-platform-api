import { MovieService } from "../servers/movieService.js";
import type { Movie } from "../types/index.js";

export const resolvers = {
  Query: {
    movies: async (): Promise<Movie[]> => {
      return (await MovieService.getAllMovies()) as Movie[];
    },

    movie: async (_: unknown, { id }: { id: string }) => {
      return await MovieService.getMovieById(id);
    },

    movieWithDetails: async (_: unknown, { id }: { id: string }) => {
      return await MovieService.getMovieWithDetails(id);
    },
  },

  Mutation: {
    createMovie: async (_: unknown, { input }: { input: Movie }) => {
      return await MovieService.createMovie(input);
    },

    updateMovie: async (
      _: unknown,
      { id, input }: { id: string; input: Movie },
    ) => {
      return await MovieService.updateMovie(id, input);
    },

    deleteMovie: async (_: unknown, { id }: { id: string }) => {
      await MovieService.deleteMovie(id);
      return "Movie deleted successfully";
    },
  },
};
