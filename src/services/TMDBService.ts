import type { TMDBMovie } from "../types/movie.js";
import axios from "../utils/axios.js";

const TMDB_KEY = process.env.TMDB_KEY;

export const TMDBService = {
  async searchMovies(query: string): Promise<TMDBMovie[]> {
    try {
      const response = await axios.get(
        `/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      );

      return response.data.results;
    } catch (error) {
      console.error("TMDB error", error);
      return [];
    }
  },
};
