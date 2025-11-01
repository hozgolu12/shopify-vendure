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
    productionOrderTasksByTenantMongoId(
      tenantMongoId: String!
    ): [ProductionOrderTask!]!
    productionOrderTasksByWorkspace(workspaceId: Int!): [ProductionOrderTask!]!
    productionOrderTasksByWorkspaceMongoId(
      workspaceMongoId: String!
    ): [ProductionOrderTask!]!
    productionOrderTasksByStatus(status: TaskStatus!): [ProductionOrderTask!]!
    productionOrderTasksByAssignee(userId: Int!): [ProductionOrderTask!]!
    productionOrderTasksByAssigneesMongoId(
      assigneeMongoId: String!
    ): [ProductionOrderTask!]!
    productionOrderTasksBySupervisor(
      supervisorId: Int!
    ): [ProductionOrderTask!]!
    productionOrderTasksBySupervisorMongoId(
      supervisorMongoId: String!
    ): [ProductionOrderTask!]!
    productionOrderTasksByCreatedByMongoId(
      createdByMongoId: String!
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
    tenantMongoId: String!
    workspace: TenantWorkspace!
    workspaceId: Int!
    workspaceMongoId: String!
    productionOrder: ProductionOrder!
    productionOrderId: Int!
    status: TaskStatus!
    startDate: DateTime
    endDate: DateTime
    assignees: [Int!]!
    assigneesMongoId: [String!]!
    supervisorUser: TenantUser
    supervisor: Int
    supervisorMongoId: String
    dependencies: [Int!]!
    remarks: String
    createdAt: DateTime!
    createdByUser: TenantUser!
    createdBy: Int!
    createdByMongoId: String!
    subTasks: [ProductionOrderTask!]!
    customFields: ProductionOrderTaskCustomFields!
  }

  type ProductionOrderTaskStatistic {
    status: TaskStatus!
    count: Int!
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    ON_HOLD
    COMPLETED
  }

  # Add at least one field to make the type valid
  type ProductionOrderTaskCustomFields {
    _dummy: String
  }

  input CreateProductionOrderTaskInput {
    parentId: Int
    tenantId: Int!
    tenantMongoId: String!
    workspaceId: Int!
    workspaceMongoId: String!
    productionOrderId: Int!
    status: TaskStatus
    startDate: DateTime
    endDate: DateTime
    assignees: [Int!]
    assigneesMongoId: [String!]
    supervisor: Int
    supervisorMongoId: String
    dependencies: [Int!]
    remarks: String
    createdBy: Int!
    createdByMongoId: String!
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
