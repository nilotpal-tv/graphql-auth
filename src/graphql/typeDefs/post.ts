import { gql } from 'apollo-server-express';

const postTypeDefs = gql`
  type Post {
    id: String!
    slug: String!
    title: String!
    body: String!
    authorId: String!
  }

  type Query {
    post(id: String!): Post!
    posts: [Post]!
  }

  input CreatePostInput {
    slug: String!
    title: String!
    body: String!
    authorId: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
  }
`;

export default postTypeDefs;
