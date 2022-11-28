import { Post } from './post';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  posts: Post[];
};
