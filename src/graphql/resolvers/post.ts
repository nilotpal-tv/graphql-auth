import { AuthenticationError } from 'apollo-server-express';
import slug from 'slug';
import GraphQLContext from '../../types/context';
import { CreatePostInput, Post } from '../../types/post';

const postResolver = {
  Query: {
    post: (): Post => {
      return null;
    },

    posts: (): Post[] => {
      return [];
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      { input }: CreatePostInput,
      { user, prisma }: GraphQLContext
    ): Promise<Post> => {
      if (!user) throw new AuthenticationError('You must login.');

      const post = await prisma.post.create({
        data: { ...input, slug: slug(input.title), authorId: user.id },
        include: { author: true },
      });

      return post;
    },
  },
};

export default postResolver;
