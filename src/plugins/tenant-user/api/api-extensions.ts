import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    userByBetterAuthId(betterAuthId: String!): TenantUser
    currentUser: TenantUser
    users: [TenantUser!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): TenantUser!
    updateUser(input: UpdateUserInput!): TenantUser!
    upsertUser(input: UpsertUserInput!): TenantUser!
  }

  type TenantUser {
    id: ID!
    betterAuthId: String!
    name: String!
    email: String!
    companyName: String
    companyType: String
    role: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    betterAuthId: String!
    name: String!
    email: String!
    companyName: String
    companyType: String
    role: String
  }

  input UpdateUserInput {
    id: ID!
    betterAuthId: String
    name: String
    email: String
    companyName: String
    companyType: String
    role: String
  }

  input UpsertUserInput {
    betterAuthId: String!
    name: String!
    email: String!
    companyName: String
    companyType: String
    role: String
  }
`;
