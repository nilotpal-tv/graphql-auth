import { User } from './user';

export type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  author: User;
};
