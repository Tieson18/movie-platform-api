import { GraphQLScalarType, Kind } from "graphql";
import { MovieService } from "../services/movieService.js";
import { ReviewService } from "../services/ReviewService.js";
import { UserService } from "../services/UserService.js";
import { WatchlistService } from "../services/WatchlistService.js";
import type { GraphQLContext } from "../types/index.js";
import { AppError } from "../utils/errors.js";

const parseJsonLiteral = (ast: import("graphql").ValueNode): unknown => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.OBJECT:
      return Object.fromEntries(ast.fields.map((field) => [field.name.value, parseJsonLiteral(field.value)]));
    case Kind.LIST:
      return ast.values.map((value) => parseJsonLiteral(value));
    case Kind.NULL:
      return null;
    default:
      return null;
  }
};

const jsonScalar = new GraphQLScalarType({
  name: "JSON",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: parseJsonLiteral,
});

const requireContextUser = (context: GraphQLContext) => {
  if (!context.user) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required");
  }

  return context.user;
};

export const resolvers = {
  JSON: jsonScalar,

  Query: {
    users: async () => UserService.list(),
    user: async (_: unknown, { id }: { id: string }) => UserService.getById(id),
    movies: async () => MovieService.list(),
    movie: async (_: unknown, { id }: { id: string }) => MovieService.getById(id),
    movieWithDetails: async (_: unknown, { id }: { id: string }) => MovieService.getDetails(id),
    movieStats: async () => MovieService.getStats(),
    movieReviews: async (_: unknown, { movieId }: { movieId: string }) =>
      ReviewService.listByMovieId(movieId),
    userWatchlist: async (_: unknown, { userId }: { userId: string }, context: GraphQLContext) =>
      WatchlistService.listByUserId(userId, requireContextUser(context)),
  },

  Mutation: {
    register: async (_: unknown, { input }: { input: Parameters<typeof UserService.register>[0] }) =>
      UserService.register(input),
    login: async (_: unknown, { input }: { input: Parameters<typeof UserService.login>[0] }) =>
      UserService.login(input),
    createMovie: async (
      _: unknown,
      { input }: { input: Parameters<typeof MovieService.create>[0] },
      context: GraphQLContext,
    ) => {
      UserService.assertRole(requireContextUser(context), "admin");
      return MovieService.create(input);
    },
    updateMovie: async (
      _: unknown,
      { id, input }: { id: string; input: Parameters<typeof MovieService.update>[1] },
      context: GraphQLContext,
    ) => {
      UserService.assertRole(requireContextUser(context), "admin");
      return MovieService.update(id, input);
    },
    deleteMovie: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      UserService.assertRole(requireContextUser(context), "admin");
      await MovieService.delete(id);
      return "Movie deleted successfully";
    },
    addReview: async (
      _: unknown,
      { input }: { input: Parameters<typeof ReviewService.create>[0] },
      context: GraphQLContext,
    ) => ReviewService.create(input, requireContextUser(context)),
    addToWatchlist: async (
      _: unknown,
      { input }: { input: Parameters<typeof WatchlistService.add>[0] },
      context: GraphQLContext,
    ) => WatchlistService.add(input, requireContextUser(context)),
    removeFromWatchlist: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await WatchlistService.remove(id, requireContextUser(context));
      return "Watchlist item removed successfully";
    },
  },

  Movie: {
    reviews: async (movie: { id: string }) => ReviewService.listByMovieId(movie.id),
  },

  User: {
    reviews: async (user: { id: string }, _: unknown, context: GraphQLContext) =>
      ReviewService.listByUserId(user.id, requireContextUser(context)),
    watchlist: async (user: { id: string }, _: unknown, context: GraphQLContext) =>
      WatchlistService.listByUserId(user.id, requireContextUser(context)),
  },

  Review: {
    user: async (review: { userId: string }) => UserService.requireById(review.userId),
    movie: async (review: { movieId: string }) => MovieService.requireById(review.movieId),
  },

  WatchlistItem: {
    user: async (item: { userId: string }) => UserService.requireById(item.userId),
    movie: async (item: { movieId: string }) => MovieService.requireById(item.movieId),
  },
};
