import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    productionOrder(id: ID!): ProductionOrder
    productionOrders(options: ProductionOrderListOptions): ProductionOrderList!
    productionOrdersByTenant(tenantId: Int!): [ProductionOrder!]!
    productionOrdersByWorkspace(workspaceId: Int!): [ProductionOrder!]!
    productionOrdersByCustomer(customerId: ID!): [ProductionOrder!]!
    productionOrdersByStatus(status: ProductionStatus!): [ProductionOrder!]!
    productionOrdersByGroup(groupId: Int!): [ProductionOrder!]!
    productionOrderStatistics(tenantId: Int!): [ProductionOrderStatistic!]!
  }

  extend type Mutation {
    createProductionOrder(input: CreateProductionOrderInput!): ProductionOrder!
    updateProductionOrder(input: UpdateProductionOrderInput!): ProductionOrder!
    updateProductionOrderStatus(
      input: UpdateProductionOrderStatusInput!
    ): ProductionOrder!
    deleteProductionOrder(id: ID!): DeletionResponse!
    createMtoOrder(
      groupTitle: String!
      orders: [CreateBulkOrderInput!]!
    ): [ProductionOrder!]!
    createAlterationOrder(
      groupTitle: String!
      orders: [CreateBulkOrderInput!]!
    ): [ProductionOrder!]!
  }

  type ProductionOrder {
    id: ID!
    tenantId: Int!
    workspace: TenantWorkspace!
    workspaceId: Int!
    customer: Customer!
    customerId: ID!
    orderType: ProductionOrderType!
    groupId: Int
    groupTitle: String
    itemCode: String!
    itemTitle: String!
    status: ProductionStatus!
    itemConfig: JSON!
    createdAt: DateTime!
    createdByUser: TenantUser!
    createdBy: Int!
    updatedAt: DateTime!
    updatedByUser: TenantUser!
    updatedBy: Int!
    customFields: ProductionOrderCustomFields!
  }

  type ProductionOrderStatistic {
    status: ProductionStatus!
    count: Int!
  }

  enum ProductionOrderType {
    ALTERATION
    MTO
    CUSTOM
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
    workspaceId: Int!
    customerId: ID!
    orderType: ProductionOrderType!
    groupId: Int
    groupTitle: String
    itemCode: String!
    itemTitle: String!
    status: ProductionStatus
    itemConfig: JSON!
    createdBy: Int!
    customFields: ProductionOrderCustomFieldsInput
  }

  input CreateBulkOrderInput {
    tenantId: Int!
    workspaceId: Int!
    customerId: ID!
    itemCode: String!
    itemTitle: String!
    status: ProductionStatus
    itemConfig: JSON!
    createdBy: Int!
    customFields: ProductionOrderCustomFieldsInput
  }

  input UpdateProductionOrderInput {
    id: ID!
    workspaceId: Int
    customerId: ID
    orderType: ProductionOrderType
    groupId: Int
    groupTitle: String
    itemCode: String
    itemTitle: String
    status: ProductionStatus
    itemConfig: JSON
    updatedBy: Int!
    customFields: ProductionOrderCustomFieldsInput
  }

  input UpdateProductionOrderStatusInput {
    id: ID!
    status: ProductionStatus!
    updatedBy: Int!
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
