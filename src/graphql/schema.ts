import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON

  type Movie {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int
    genre: String!
    rating: Float!
    externalData: JSON
    reviews: [Review!]!
  }

  type MovieStats {
    totalMovies: Int!
    averageRating: Float!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
    reviews: [Review!]!
    watchlist: [WatchlistItem!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Review {
    id: ID!
    userId: ID!
    movieId: ID!
    rating: Float!
    comment: String
    createdAt: String!
    user: User!
    movie: Movie!
  }

  type WatchlistItem {
    id: ID!
    userId: ID!
    movieId: ID!
    createdAt: String!
    user: User!
    movie: Movie!
  }

  input MovieInput {
    title: String!
    director: String!
    releaseYear: Int
    genre: String!
    rating: Float!
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    role: String
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input AddReviewInput {
    userId: ID!
    movieId: ID!
    rating: Float!
    comment: String
  }

  input AddToWatchlistInput {
    userId: ID!
    movieId: ID!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    movies: [Movie!]!
    movie(id: ID!): Movie
    movieWithDetails(id: ID!): Movie
    movieStats: MovieStats!
    movieReviews(movieId: ID!): [Review!]!
    userWatchlist(userId: ID!): [WatchlistItem!]!
  }

  type Mutation {
    register(input: RegisterUserInput!): AuthPayload!
    login(input: LoginUserInput!): AuthPayload!
    createMovie(input: MovieInput!): Movie!
    updateMovie(id: ID!, input: MovieInput!): Movie!
    deleteMovie(id: ID!): String!
    addReview(input: AddReviewInput!): Review!
    addToWatchlist(input: AddToWatchlistInput!): WatchlistItem!
    removeFromWatchlist(id: ID!): String!
  }
`;
