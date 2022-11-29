import { gql } from 'apollo-server-express';

const postTypeDefs = gql`
  type Post {
    id: String!
    slug: String!
    title: String!
    body: String!
    author: User!
  }

  type User {
    id: String!
    email: String!
    lastName: String!
    firstName: String!
  }

  type Query {
    post(id: String!): Post!
    posts: [Post]!
  }

  input CreatePostInput {
    title: String!
    body: String!
  }

  type Query {
    post(id: String!): Post
    posts: [Post]
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
  }
`;

export default postTypeDefs;
