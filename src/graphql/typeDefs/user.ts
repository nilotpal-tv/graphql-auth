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

  type RegisterUserResponse {
    id: String!
    email: String!
    lastName: String!
    firstName: String!
    posts: [Post]!
  }

  type LoginUserResponse {
    accessToken: String!
    refreshToken: String!
  }

  type DeleteAccountResponse {
    success: Boolean!
  }

  input RegisterUserInput {
    email: String!
    lastName: String!
    firstName: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input UpdateInfoUserInput {
    firstName: String
    lastName: String
  }

  type Query {
    user(email: String!): User!
  }

  type Mutation {
    register(input: RegisterUserInput!): RegisterUserResponse!
    login(input: LoginUserInput!): LoginUserResponse!
    deleteAccount: DeleteAccountResponse!
    updateInfo(input: UpdateInfoUserInput!): RegisterUserResponse
  }
`;

export default userTypeDefs;
