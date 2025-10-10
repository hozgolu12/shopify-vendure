import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    productKit(id: ID!): ProductKit
    productKits(options: ProductKitListOptions): ProductKitList!
    productKitByBarcode(barcode: String!, channelId: ID!): ProductKit
    productKitByName(itemKitName: String!, channelId: ID!): ProductKit
    productKitsByChannel(channelId: ID!): [ProductKit!]!
  }

  extend type Mutation {
    createProductKit(input: CreateProductKitInput!): ProductKit!
    updateProductKit(input: UpdateProductKitInput!): ProductKit!
    deleteProductKit(id: ID!): DeletionResponse!
    addProductVariantToKit(
      productKitId: ID!
      productVariantId: ID!
    ): ProductKit!
    removeProductVariantFromKit(
      productKitId: ID!
      productVariantId: ID!
    ): ProductKit!
  }

  type ProductKit {
    id: ID!
    barcode: String!
    itemKitName: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    productVariants: [ProductVariant!]!
    channel: Channel!
    channelId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    customFields: ProductKitCustomFields!
  }

  enum DiscountType {
    PERCENTAGE
    FIXED
  }

  # Add at least one field to make the type valid
  type ProductKitCustomFields {
    _dummy: String
  }

  input CreateProductKitInput {
    barcode: String!
    itemKitName: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    productVariantIds: [ID!]!
    channelId: ID! # Required channel ID
    customFields: ProductKitCustomFieldsInput
  }

  input UpdateProductKitInput {
    id: ID!
    barcode: String
    itemKitName: String
    description: String
    discountType: DiscountType
    discountValue: Float
    productVariantIds: [ID!]
    channelId: ID # Optional channel update
    customFields: ProductKitCustomFieldsInput
  }

  # Add at least one field to make the input type valid
  input ProductKitCustomFieldsInput {
    _dummy: String
  }

  input ProductKitListOptions {
    skip: Int
    take: Int
  }

  type ProductKitList {
    items: [ProductKit!]!
    totalItems: Int!
  }
`;
