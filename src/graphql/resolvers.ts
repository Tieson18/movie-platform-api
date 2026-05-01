import { MovieService } from "../servers/movieService.js";
import type { Movie } from "../types/index.js";

export const resolvers = {
  Query: {
    movies: async (): Promise<Movie[]> => {
      return (await MovieService.MovieService_list()) as Movie[];
    },

    movie: async (_: unknown, { id }: { id: string }) => {
      return await MovieService.MovieService_get(id);
    },

    movieWithDetails: async (_: unknown, { id }: { id: string }) => {
      return await MovieService.MovieService_getDetails(id);
    },
  },

  Mutation: {
    createMovie: async (_: unknown, { input }: { input: Movie }) => {
      return await MovieService.MovieService_create(input);
    },

    updateMovie: async (
      _: unknown,
      { id, input }: { id: string; input: Movie },
    ) => {
      return await MovieService.MovieService_update(id, input);
    },

    deleteMovie: async (_: unknown, { id }: { id: string }) => {
      await MovieService.MovieService_delete(id);
      return "Movie deleted successfully";
    },
  },
};
