import { Post } from '../../types/post';

const postResolver = {
  Query: {
    post: (): Post => {
      return null;
    },

    posts: (): Post[] => {
      return [];
    },
  },
};

export default postResolver;
