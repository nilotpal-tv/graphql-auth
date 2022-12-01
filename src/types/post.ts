import { User } from './user';

export type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  author: User;
};

export type CreatePostInput = {
  input: {
    title: string;
    body: string;
  };
};

export type UpdatePostInput = {
  input: {
    body: string;
    id: string;
  };
};

export type DeletePostInput = {
  input: {
    id: string;
  };
};

export const NEW_POST = 'NEW_POST';
