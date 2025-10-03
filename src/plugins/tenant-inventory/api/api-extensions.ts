import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    tenantInventory(id: ID!): TenantInventory
    tenantInventorys(options: TenantInventoryListOptions): TenantInventoryList!
    tenantInventoriesByUserId(userId: ID!): [TenantInventory!]!
    tenantInventoriesByWorkspaceId(workspaceId: String!): [TenantInventory!]!
  }

  extend type Mutation {
    createTenantInventory(input: CreateTenantInventoryInput!): TenantInventory!
    updateTenantInventory(input: UpdateTenantInventoryInput!): TenantInventory!
    deleteTenantInventory(id: ID!): DeletionResponse!
  }

  type TenantInventory {
    id: ID!
    user: TenantUser!
    userId: ID!
    workspaceId: String
    productRegions: [String!]!
    silhouetteCategories: [SilhouetteCategory!]!
    modifiers: [Modifier!]!
    attributes: [Attribute!]!
    embellishments: [Embellishment!]!
    motifs: [Motif!]!
    trimsClosures: [TrimClosure!]!
    regularAttributes: [RegularAttribute!]!
    itemCode: ItemCode!
    createdAt: DateTime!
    updatedAt: DateTime!
    customFields: TenantInventoryCustomFields!
  }

  type SilhouetteCategory {
    id: ID!
    silhouetteId: String!
    name: String!
    enabled: Boolean!
    silhouetteTypes: [String!]!
  }

  type Modifier {
    id: ID!
    modifierId: String!
    groupName: String!
    enabled: Boolean!
    modifiers: [String!]!
  }

  type Attribute {
    id: ID!
    attributeId: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
  }

  type Embellishment {
    id: ID!
    embellishmentId: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
    code: String
  }

  type Motif {
    id: ID!
    motifId: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
    code: String
  }

  type TrimClosure {
    id: ID!
    trimClosureId: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
  }

  type RegularAttribute {
    id: ID!
    regularAttributeId: String!
    name: String!
    description: String!
    enabled: Boolean!
    properties: [String!]!
    group: String
    parent: String
    abbreviation: String
  }

  type ItemCode {
    id: ID!
    itemCodeAttributes: [String!]!
    itemNameAttributes: [String!]!
    delimiter: String!
    itemCode: String!
    itemName: String!
  }

  # Add at least one field to make the type valid
  type TenantInventoryCustomFields {
    _dummy: String
  }

  input CreateTenantInventoryInput {
    userId: ID!
    workspaceId: String
    productRegions: [String!]!
    silhouetteCategories: [SilhouetteCategoryInput!]!
    modifiers: [ModifierInput!]!
    attributes: [AttributeInput!]!
    embellishments: [EmbellishmentInput!]!
    motifs: [MotifInput!]!
    trimsClosures: [TrimClosureInput!]!
    regularAttributes: [RegularAttributeInput!]!
    itemCode: ItemCodeInput!
    customFields: TenantInventoryCustomFieldsInput
  }

  input UpdateTenantInventoryInput {
    id: ID!
    workspaceId: String
    productRegions: [String!]
    customFields: TenantInventoryCustomFieldsInput
  }

  input SilhouetteCategoryInput {
    id: String!
    name: String!
    enabled: Boolean!
    silhouetteTypes: [String!]!
  }

  input ModifierInput {
    id: String!
    groupName: String!
    enabled: Boolean!
    modifiers: [String!]!
  }

  input AttributeInput {
    id: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
  }

  input EmbellishmentInput {
    id: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
    code: String
  }

  input MotifInput {
    id: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
    code: String
  }

  input TrimClosureInput {
    id: String!
    groupName: String!
    enabled: Boolean!
    values: [String!]!
  }

  input RegularAttributeInput {
    id: String!
    name: String!
    description: String!
    enabled: Boolean!
    properties: [String!]!
    group: String
    parent: String
    abbreviation: String
  }

  input ItemCodeInput {
    itemCodeAttributes: [String!]!
    itemNameAttributes: [String!]!
    delimiter: String!
    itemCode: String!
    itemName: String!
  }

  # Add at least one field to make the input type valid
  input TenantInventoryCustomFieldsInput {
    _dummy: String
  }

  input TenantInventoryListOptions {
    skip: Int
    take: Int
  }

  type TenantInventoryList {
    items: [TenantInventory!]!
    totalItems: Int!
  }
`;
