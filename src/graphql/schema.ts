import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    director: String!
    release_year: Int
    genre: String!
    rating: Float!
    externalData: JSON
  }

  scalar JSON

  input MovieInput {
    title: String!
    director: String!
    release_year: Int
    genre: String!
    rating: Float!
  }

  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
    movieWithDetails(id: ID!): Movie
  }

  type Mutation {
    createMovie(input: MovieInput!): Movie
    updateMovie(id: ID!, input: MovieInput!): Movie
    deleteMovie(id: ID!): String
  }
`;
