import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { compare, hash } from 'bcrypt';
import { generateTokens } from '../../lib/jwt';
import GraphQLContext from '../../types/context';
import {
  LoginUserInput,
  LoginUserResponse,
  RegisterUserInput,
  User,
} from '../../types/user';

const userResolver = {
  Query: {
    user: async (
      _: any,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<User> => {
      if (!id) throw new ApolloError('id is required.');
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
    },
  },

  Mutation: {
    register: async (
      _: any,
      { input }: RegisterUserInput,
      { prisma }: GraphQLContext
    ): Promise<User> => {
      const { email, firstName, lastName, password } = input;
      const existUser = await prisma.user.findUnique({ where: { email } });

      if (existUser)
        throw new ApolloError('Email is already registered', '409');

      const hashedPassword = await hash(password, 15);
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      });

      return { ...user, posts: [] };
    },

    login: async (
      _: any,
      { input }: LoginUserInput,
      { prisma }: GraphQLContext
    ): Promise<LoginUserResponse> => {
      const { email, password } = input;

      if (!email || !password)
        throw new ApolloError('All fields are required', '400');

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError('Invalid email or password.');

      const isMatchPassword = await compare(password, user.password);
      if (!isMatchPassword)
        throw new AuthenticationError('Invalid email or password.');

      const accessToken = generateTokens({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
      });

      return { accessToken };
    },

    deleteAccount: async (
      _: any,
      __: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) throw new AuthenticationError('You must log in.');
      await prisma.user.delete({ where: { id: user.id } });
      return { success: true };
    },
  },
};

export default userResolver;
