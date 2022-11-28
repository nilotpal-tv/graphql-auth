import { PrismaClient, User } from '@prisma/client';

type GraphQLContext = {
  prisma: PrismaClient;
  user: User
};

export default GraphQLContext;
