import userService from '../../services/user.service';
import GraphQLContext from '../../types/context';
import {
  LoginUserInput,
  RegisterUserInput,
  UpdateUserInput,
  User,
} from '../../types/user';

const userResolver = {
  Query: {
    user: async (_: any, { id }: { id: string }): Promise<User> =>
      userService.findById(id),
  },

  Mutation: {
    register: async (_: any, { input }: RegisterUserInput): Promise<User> => {
      const user = await userService.register(input);
      return { ...user, posts: [] };
    },

    login: async (
      _: any,
      { input }: LoginUserInput
    ): Promise<{ token: string }> => {
      const token = await userService.login(input);
      return { token };
    },

    deleteAccount: async (_: any, __: any, { user }: GraphQLContext) => {
      userService.checkIfLoggedIn(user);
      await userService.deleteAccount(user.id);
      return { success: true };
    },

    updateInfo: async (
      _: any,
      { input }: UpdateUserInput,
      { user }: GraphQLContext
    ): Promise<User> => {
      userService.checkIfLoggedIn(user);
      const updatedUser = await userService.updateInfo(user.id, input);
      return updatedUser;
    },
  },
};

export default userResolver;
