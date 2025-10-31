import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    productionOrder(id: ID!): ProductionOrder
    productionOrders(options: ProductionOrderListOptions): ProductionOrderList!
    productionOrdersByTenant(tenantId: Int!): [ProductionOrder!]!
    productionOrdersByTenantMongoId(tenantMongoId: String!): [ProductionOrder!]!
    productionOrdersByWorkspace(workspaceId: Int!): [ProductionOrder!]!
    productionOrdersByWorkspaceMongoId(
      workspaceMongoId: String!
    ): [ProductionOrder!]!
    productionOrdersByCustomer(customerId: ID!): [ProductionOrder!]!
    productionOrdersByStatus(status: ProductionStatus!): [ProductionOrder!]!
    productionOrdersByStage(stage: String!): [ProductionOrder!]!
    productionOrdersByVendureOrder(vendureOrderId: Int!): [ProductionOrder!]!
    productionOrderStatisticsByStatus(
      tenantId: Int!
    ): [ProductionOrderStatusStatistic!]!
    productionOrderStatisticsByStage(
      tenantId: Int!
    ): [ProductionOrderStageStatistic!]!
  }

  extend type Mutation {
    createProductionOrder(input: CreateProductionOrderInput!): ProductionOrder!
    updateProductionOrder(input: UpdateProductionOrderInput!): ProductionOrder!
    updateProductionOrderStatus(
      input: UpdateProductionOrderStatusInput!
    ): ProductionOrder!
    updateProductionOrderStage(
      input: UpdateProductionOrderStageInput!
    ): ProductionOrder!
    deleteProductionOrder(id: ID!): DeletionResponse!
  }

  type ProductionOrder {
    id: ID!
    tenantId: Int!
    tenantMongoId: String!
    workspace: TenantWorkspace!
    workspaceId: Int!
    workspaceMongoId: String!
    vendureOrder: Order
    vendureOrderId: Int
    vendureItemId: Int
    productKit: ProductKit
    productKitId: Int
    customer: Customer!
    customerId: ID!
    orderType: ProductionOrderType!
    productKitTitle: String
    itemCode: String!
    itemTitle: String!
    itemConfig: JSON!
    status: ProductionStatus!
    stage: String!
    designId: Int
    createdAt: DateTime!
    createdByUser: TenantUser!
    createdBy: Int!
    customFields: ProductionOrderCustomFields!
  }

  type ProductionOrderStatusStatistic {
    status: ProductionStatus!
    count: Int!
  }

  type ProductionOrderStageStatistic {
    stage: String!
    count: Int!
  }

  enum ProductionOrderType {
    ALTERATION
    PRODUCTION
    SAMPLE
  }

  enum ProductionStatus {
    DRAFT
    PENDING
    IN_PROGRESS
    READY_FOR_QC
    COMPLETED
    CANCELLED
    ON_HOLD
  }

  # Add at least one field to make the type valid
  type ProductionOrderCustomFields {
    _dummy: String
  }

  input CreateProductionOrderInput {
    tenantId: Int!
    tenantMongoId: String!
    workspaceId: Int!
    workspaceMongoId: String!
    vendureOrderId: Int
    vendureItemId: Int
    productKitId: Int
    customerId: ID!
    orderType: ProductionOrderType!
    productKitTitle: String
    itemCode: String!
    itemTitle: String!
    itemConfig: JSON!
    status: ProductionStatus
    stage: String
    designId: Int
    createdBy: Int!
    customFields: ProductionOrderCustomFieldsInput
  }

  input UpdateProductionOrderInput {
    id: ID!
    workspaceId: Int
    vendureOrderId: Int
    vendureItemId: Int
    productKitId: Int
    customerId: ID
    orderType: ProductionOrderType
    productKitTitle: String
    itemCode: String
    itemTitle: String
    itemConfig: JSON
    status: ProductionStatus
    stage: String
    designId: Int
    customFields: ProductionOrderCustomFieldsInput
  }

  input UpdateProductionOrderStatusInput {
    id: ID!
    status: ProductionStatus!
  }

  input UpdateProductionOrderStageInput {
    id: ID!
    stage: String!
  }

  # Add at least one field to make the input type valid
  input ProductionOrderCustomFieldsInput {
    _dummy: String
  }

  input ProductionOrderListOptions {
    skip: Int
    take: Int
  }

  type ProductionOrderList {
    items: [ProductionOrder!]!
    totalItems: Int!
  }
`;
