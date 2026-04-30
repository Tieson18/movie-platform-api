import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    genre: String!
    rating: Float!
    release_year: Int
    externalData: JSON
  }

  scalar JSON

  input MovieInput {
    title: String!
    genre: String!
    rating: Float!
    release_year: Int
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
