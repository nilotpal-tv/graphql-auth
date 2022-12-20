import { gql } from 'apollo-server-express';

const postTypeDefs = gql`
  type Post {
    id: String!
    slug: String!
    title: String!
    body: String!
    author: User!
  }

  input CreatePostInput {
    title: String!
    body: String!
  }

  type DeletePostResponse {
    success: Boolean!
  }

  input UpdatePostInput {
    id: String!
    body: String!
  }

  input DeletePostInput {
    id: String!
  }

  type Query {
    postById(id: String!): Post
    postsByText(text: String!): [Post]!
    posts: [Post]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(input: DeletePostInput!): DeletePostResponse!
  }

  type Subscription {
    postCreated: Post!
  }
`;

export default postTypeDefs;
