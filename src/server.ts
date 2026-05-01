import dotenv from "dotenv";
import app from "./app.js";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

dotenv.config();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
    bodyParserConfig: false, // Disable body parsing to let Apollo handle it
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`REST: http://localhost:${PORT}/movies`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
  });
}

startServer();
