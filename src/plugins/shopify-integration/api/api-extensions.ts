import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    shopifySettingsByTenant(tenantId: Int!): ShopifySettings
  }

  extend type Mutation {
    upsertShopifySettings(input: ShopifySettingsInput!): ShopifySettings!
    syncShopifyProducts(tenantId: Int!): SyncResult!
    syncShopifyCustomers(tenantId: Int!): SyncResult!
    syncShopifyOrders(tenantId: Int!): SyncResult!
  }

  type ShopifySettings {
    id: ID!
    tenantId: Int!
    shopDomain: String!
    apiKey: String
    apiSecret: String
    accessToken: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input ShopifySettingsInput {
    id: ID
    tenantId: Int!
    shopDomain: String!
    apiKey: String
    apiSecret: String
    accessToken: String
  }

  type SyncResult {
    result: String!
  }
`;
