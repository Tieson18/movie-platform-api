import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 300 }); // 5 min

export const CACHE_KEYS = {
  movies: "movies",
  movieStats: "movieStats",
} as const;

export const invalidateMovieCache = () => {
  cache.del([CACHE_KEYS.movies, CACHE_KEYS.movieStats]);
};
