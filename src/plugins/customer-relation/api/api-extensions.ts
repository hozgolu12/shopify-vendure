import gql from "graphql-tag";

export const sharedTypes = gql`
  type CustomerRelation {
    customer: Customer!
    type: String!
  }
`;

export const shopApiExtensions = gql`
  ${sharedTypes}
  extend type Customer {
    outgoingRelations: [CustomerRelation!]!
    incomingRelations: [CustomerRelation!]!
  }

  extend type Mutation {
    addRelation(toCustomerId: ID!, type: String!): [CustomerRelation!]!
    removeRelation(toCustomerId: ID!, type: String!): [CustomerRelation!]!
  }
`;

export const adminApiExtensions = gql`
  ${sharedTypes}
  extend type Customer {
    outgoingRelations: [CustomerRelation!]!
    incomingRelations: [CustomerRelation!]!
  }

  extend type Mutation {
    addRelationForCustomer(
      fromCustomerId: ID!
      toCustomerId: ID!
      type: String!
    ): [CustomerRelation!]!
    removeRelationForCustomer(
      fromCustomerId: ID!
      toCustomerId: ID!
      type: String!
    ): [CustomerRelation!]!
  }
`;
