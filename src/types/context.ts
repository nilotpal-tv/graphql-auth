import { PrismaClient } from '@prisma/client';

type GraphQLContext = {
  prisma: PrismaClient;
};

export default GraphQLContext;
