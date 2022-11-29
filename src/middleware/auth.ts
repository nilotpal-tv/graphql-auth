import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import { verifyToken } from '../lib/jwt';
import GraphQLContext from '../types/context';

const prisma = new PrismaClient();

const authMiddleware = async (
  context: ExpressContext
): Promise<GraphQLContext> => {
  const { req } = context;
  const Bearer = req.headers.authorization;
  if (!Bearer) return { prisma, user: null };

  try {
    const token = Bearer.split(' ')[1];
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    return { prisma, user };
  } catch (error) {
    return { prisma, user: null };
  }
};

export default authMiddleware;
