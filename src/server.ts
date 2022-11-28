import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';

import corsOptions from './constants/cors';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import authMiddleware from './middleware/auth';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(cors(corsOptions));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const server = new ApolloServer({
  schema,
  context: authMiddleware,
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((error) => console.log(error));
