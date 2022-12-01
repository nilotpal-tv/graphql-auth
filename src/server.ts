import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import authMiddleware from './middleware/auth';

dotenv.config();
const app = express();

const httpServer = createServer(app);
const PORT = Number(process.env.PORT) || 4000;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema, context: authMiddleware });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: `/${server.graphqlPath}`,
});
useWsServer({ schema }, wsServer);

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({
    app,
  });
  httpServer.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((error) => console.log(error));
