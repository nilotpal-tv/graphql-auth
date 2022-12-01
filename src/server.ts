import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import corsOptions from './constants/cors';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import authMiddleware from './middleware/auth';

dotenv.config();
const app = express();
app.use(cors(corsOptions));

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
    cors: {
      origin: [
        'http://localhost:4000',
        'http://localhost:4000/graphql',
        'https://studio.apollographql.com',
        'https://lucasconstantino.github.io/graphiql-online',
      ],
    },
  });
  httpServer.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((error) => console.log(error));
