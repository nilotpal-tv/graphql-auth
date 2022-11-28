import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  type User {
    id: String!
    email: String!
    lastName: String!
    firstName: String!
    password: String!
  }

  type Post {
    id: String!
    slug: String!
    title: String!
    body: String!
    authorId: String!
  }

  type CreateUserResponse {
    id: String!
    email: String!
    lastName: String!
    firstName: String!
    posts: [Post]!
  }

  input RegisterUserInput {
    email: String!
    lastName: String!
    firstName: String!
    password: String!
  }

  type Query {
    user(email: String!): User!
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User!
  }
`;

export default userTypeDefs;
