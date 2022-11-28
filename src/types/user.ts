import { Post } from './post';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  posts?: Post[];
};

export type RegisterUserInput = {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

export type LoginUserInput = {
  input: {
    email: string;
    password: string;
  };
};

export type UpdateUserInput = {
  input: {
    firstName: string;
    lastName: string;
  };
};

export type LoginUserResponse = {
  accessToken: string;
};
