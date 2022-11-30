import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { compare, hash } from 'bcrypt';
import { generateTokens } from '../../lib/jwt';
import GraphQLContext from '../../types/context';
import {
  LoginUserInput,
  RegisterUserInput,
  UpdateUserInput,
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
      return user as User;
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
    ): Promise<{ token: string }> => {
      const { email, password } = input;

      if (!email || !password)
        throw new ApolloError('All fields are required', '400');

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError('Invalid email or password.');

      const isMatchPassword = await compare(password, user.password);
      if (!isMatchPassword)
        throw new AuthenticationError('Invalid email or password.');

      const token = generateTokens({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
      });

      return { token };
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

    updateInfo: async (
      _: any,
      { input }: UpdateUserInput,
      { user, prisma }: GraphQLContext
    ): Promise<User> => {
      if (!user) throw new AuthenticationError('You must log in.');

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { ...input },
      });

      return updatedUser;
    },
  },
};

export default userResolver;
