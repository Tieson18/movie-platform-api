export const typeDefs = `#graphql
  type Movie {
    id: ID
    title: String
    genre: String
    rating: Float
    release_year: Int
  }

  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
  }

  type Mutation {
    createMovie(title: String!, genre: String!, rating: Float!): Movie
  }
`;
