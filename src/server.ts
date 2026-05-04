import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import app from "./app.js";
import { initializeDatabase } from "./config/db.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/schema.js";
import type { GraphQLContext } from "./types/index.js";

dotenv.config();

async function startServer() {
  await initializeDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }): Promise<GraphQLContext> => ({
      user: req.user ?? null,
    }),
  });

  await server.start();

  const middlewareApp = app as unknown as Parameters<typeof server.applyMiddleware>[0]["app"];

  server.applyMiddleware({
    app: middlewareApp,
    path: "/graphql",
    bodyParserConfig: false,
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`REST: http://localhost:${PORT}/movies`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
  });
}

startServer();
