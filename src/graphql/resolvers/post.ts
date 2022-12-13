import { PubSub } from 'graphql-subscriptions';
import postService from '../../services/post.service';
import userService from '../../services/user.service';
import GraphQLContext from '../../types/context';
import {
  CreatePostInput,
  DeletePostInput,
  NEW_POST,
  Post,
  UpdatePostInput,
} from '../../types/post';

const pubSub = new PubSub();

const postResolver = {
  Query: {
    postById: async (
      _: any,
      { id }: { id: string },
      { user }: GraphQLContext
    ): Promise<Post> => {
      userService.checkIfLoggedIn(user);
      const post = await postService.postById(id);
      return post;
    },

    postsByText: async (
      _: any,
      { text }: { text: string },
      { user }: GraphQLContext
    ): Promise<Post[]> => {
      userService.checkIfLoggedIn(user);
      const posts = await postService.postsByText(text);
      return posts;
    },

    posts: async (
      _: any,
      __: any,
      { prisma }: GraphQLContext
    ): Promise<Post[]> => {
      const posts = await prisma.post.findMany({ include: { author: true } });
      return posts;
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      { input }: CreatePostInput,
      { user }: GraphQLContext
    ): Promise<Post> => {
      userService.checkIfLoggedIn(user);
      const post = await postService.createPost(input, user);
      pubSub.publish(NEW_POST, { postCreated: post });
      return post;
    },

    updatePost: async (
      _: any,
      args: UpdatePostInput,
      { user }: GraphQLContext
    ) => {
      userService.checkIfLoggedIn(user);
      const updatedPost = await postService.updatePost(args, user);
      return updatedPost;
    },

    deletePost: async (
      _: any,
      { input }: DeletePostInput,
      { user }: GraphQLContext
    ): Promise<{ success: boolean }> => {
      userService.checkIfLoggedIn(user);
      await postService.deletePost(input.id, user.id);
      return { success: true };
    },
  },

  Subscription: {
    postCreated: {
      subscribe: () => {
        return pubSub.asyncIterator(NEW_POST);
      },
    },
  },
};

export default postResolver;
