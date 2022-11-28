import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import GraphQLContext from './types/context';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 4000;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const server = new ApolloServer({
  schema,
  context: (): GraphQLContext => ({ prisma }),
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((error) => console.log(error));
