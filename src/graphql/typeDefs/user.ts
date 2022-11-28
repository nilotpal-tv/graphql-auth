import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  type User {
    id: String!
    email: String!
    lastName: String!
    firstName: String!
  }

  type Post {
    id: String!
    slug: String!
    title: String!
    body: String!
    authorId: String!
  }

  type Query {
    user(id: String!): User
  }
`;

export default userTypeDefs;
