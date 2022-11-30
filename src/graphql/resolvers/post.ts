import { ApolloError, AuthenticationError } from 'apollo-server-express';
import isObjectID from 'bson-objectid';
import slug from 'slug';
import { v4 as uuid } from 'uuid';
import GraphQLContext from '../../types/context';
import { CreatePostInput, Post, UpdatePostInput } from '../../types/post';

const postResolver = {
  Query: {
    postById: async (
      _: any,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Post> => {
      if (!id) throw new ApolloError('Id is required.');
      if (!isObjectID.isValid(id)) throw new ApolloError('Provide a valid id.');

      const post = await prisma.post.findUnique({
        where: { id },
        include: { author: true },
      });
      return post as Post;
    },

    postsByText: async (
      _: any,
      { text }: { text: string },
      { prisma }: GraphQLContext
    ) => {
      const post = await prisma.post.findMany({
        where: { title: { contains: text } },
        include: { author: true },
      });
      return post;
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
      { user, prisma }: GraphQLContext
    ): Promise<Post> => {
      if (!user) throw new AuthenticationError('You must login.');

      const uniqueSlug = slug(input.title);
      const existPost = await prisma.post.findUnique({
        where: { slug: uniqueSlug },
      });

      if (existPost) {
        const newSlug = `${slug(input.title)}_${uuid()}`;
        const post = await prisma.post.create({
          data: { ...input, slug: newSlug, authorId: user.id },
          include: { author: true },
        });
        return post;
      } else {
        const post = await prisma.post.create({
          data: { ...input, slug: slug(input.title), authorId: user.id },
          include: { author: true },
        });
        return post;
      }
    },

    updatePost: async (
      _: any,
      { input }: UpdatePostInput,
      { user, prisma }: GraphQLContext
    ) => {
      if (!user) throw new AuthenticationError('You must login.');

      if (!input.body || !input.id)
        throw new ApolloError('All fields are required.');

      if (!isObjectID.isValid(input.id))
        throw new ApolloError('Invalid post id.');

      try {
        const post = await prisma.post.findUnique({
          where: { id: input.id },
          include: { author: true },
        });

        if (!post) throw new ApolloError("Post doesn't exist.", '404');
        if (post.authorId.toString() !== user.id.toString())
          throw new ApolloError("You can't update other user's post.", '400');

        const updatedPost = await prisma.post.update({
          where: { id: post.id },
          data: { body: input.body },
          include: { author: true },
        });

        return updatedPost;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};

export default postResolver;
