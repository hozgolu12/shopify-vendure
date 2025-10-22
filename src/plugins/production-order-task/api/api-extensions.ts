import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    productionOrderTask(id: ID!): ProductionOrderTask
    productionOrderTasks(
      options: ProductionOrderTaskListOptions
    ): ProductionOrderTaskList!
    productionOrderTasksByProductionOrder(
      productionOrderId: Int!
    ): [ProductionOrderTask!]!
    productionOrderTasksByTenant(tenantId: Int!): [ProductionOrderTask!]!
    productionOrderTasksByWorkspace(workspaceId: Int!): [ProductionOrderTask!]!
    productionOrderTasksByStatus(status: TaskStatus!): [ProductionOrderTask!]!
    productionOrderTasksByAssignee(userId: Int!): [ProductionOrderTask!]!
    productionOrderTasksBySupervisor(
      supervisorId: Int!
    ): [ProductionOrderTask!]!
    productionOrderSubTasks(parentId: Int!): [ProductionOrderTask!]!
    productionOrderTaskStatistics(
      tenantId: Int!
    ): [ProductionOrderTaskStatistic!]!
  }

  extend type Mutation {
    createProductionOrderTask(
      input: CreateProductionOrderTaskInput!
    ): ProductionOrderTask!
    updateProductionOrderTask(
      input: UpdateProductionOrderTaskInput!
    ): ProductionOrderTask!
    updateProductionOrderTaskStatus(
      input: UpdateProductionOrderTaskStatusInput!
    ): ProductionOrderTask!
    assignProductionOrderTask(
      input: AssignProductionOrderTaskInput!
    ): ProductionOrderTask!
    addProductionOrderTaskDependency(
      taskId: ID!
      dependencyTaskId: Int!
    ): ProductionOrderTask!
    deleteProductionOrderTask(id: ID!): DeletionResponse!
  }

  type ProductionOrderTask {
    id: ID!
    parent: ProductionOrderTask
    parentId: Int
    tenantId: Int!
    workspace: TenantWorkspace!
    workspaceId: Int!
    productionOrder: ProductionOrder!
    productionOrderId: Int!
    status: TaskStatus!
    startDate: DateTime
    endDate: DateTime
    assignees: [Int!]!
    supervisorUser: TenantUser
    supervisor: Int
    dependencies: [Int!]!
    remarks: String
    createdAt: DateTime!
    createdByUser: TenantUser!
    createdBy: Int!
    subTasks: [ProductionOrderTask!]!
    customFields: ProductionOrderTaskCustomFields!
  }

  type ProductionOrderTaskStatistic {
    status: TaskStatus!
    count: Int!
  }

  enum TaskStatus {
    TO_DO
    IN_PROGRESS
    ON_HOLD
    DONE
  }

  # Add at least one field to make the type valid
  type ProductionOrderTaskCustomFields {
    _dummy: String
  }

  input CreateProductionOrderTaskInput {
    parentId: Int
    tenantId: Int!
    workspaceId: Int!
    productionOrderId: Int!
    status: TaskStatus
    startDate: DateTime
    endDate: DateTime
    assignees: [Int!]
    supervisor: Int
    dependencies: [Int!]
    remarks: String
    createdBy: Int!
    customFields: ProductionOrderTaskCustomFieldsInput
  }

  input UpdateProductionOrderTaskInput {
    id: ID!
    parentId: Int
    workspaceId: Int
    productionOrderId: Int
    status: TaskStatus
    startDate: DateTime
    endDate: DateTime
    assignees: [Int!]
    supervisor: Int
    dependencies: [Int!]
    remarks: String
    customFields: ProductionOrderTaskCustomFieldsInput
  }

  input UpdateProductionOrderTaskStatusInput {
    id: ID!
    status: TaskStatus!
  }

  input AssignProductionOrderTaskInput {
    id: ID!
    assignees: [Int!]!
    supervisor: Int
  }

  # Add at least one field to make the input type valid
  input ProductionOrderTaskCustomFieldsInput {
    _dummy: String
  }

  input ProductionOrderTaskListOptions {
    skip: Int
    take: Int
  }

  type ProductionOrderTaskList {
    items: [ProductionOrderTask!]!
    totalItems: Int!
  }
`;
