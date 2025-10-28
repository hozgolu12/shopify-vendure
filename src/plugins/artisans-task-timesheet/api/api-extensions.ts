import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    artisanTaskTimesheet(id: ID!): ArtisanTaskTimesheet
    artisanTaskTimesheets(
      options: ArtisanTaskTimesheetListOptions
    ): ArtisanTaskTimesheetList!
    artisanTaskTimesheetsByTenant(tenantId: Int!): [ArtisanTaskTimesheet!]!
    artisanTaskTimesheetsByWorkspace(
      workspaceId: Int!
    ): [ArtisanTaskTimesheet!]!
    artisanTaskTimesheetsByArtisan(artisanId: Int!): [ArtisanTaskTimesheet!]!
    artisanTaskTimesheetsByProductionOrder(
      productionOrderId: Int!
    ): [ArtisanTaskTimesheet!]!
    artisanTaskTimesheetsByDateRange(
      startDate: DateTime!
      endDate: DateTime!
    ): [ArtisanTaskTimesheet!]!
    activeArtisanTaskTimesheets(artisanId: Int): [ArtisanTaskTimesheet!]!
    artisanTaskTimesheetStatistics(
      tenantId: Int!
      startDate: DateTime
      endDate: DateTime
    ): ArtisanTaskTimesheetStatistics!
    artisanProductivityReport(
      artisanId: Int!
      startDate: DateTime!
      endDate: DateTime!
    ): ArtisanProductivityReport!
  }

  extend type Mutation {
    createArtisanTaskTimesheet(
      input: CreateArtisanTaskTimesheetInput!
    ): ArtisanTaskTimesheet!
    updateArtisanTaskTimesheet(
      input: UpdateArtisanTaskTimesheetInput!
    ): ArtisanTaskTimesheet!
    stopArtisanTaskTimesheet(
      input: StopArtisanTaskTimesheetInput!
    ): ArtisanTaskTimesheet!
    deleteArtisanTaskTimesheet(id: ID!): DeletionResponse!
  }

  type ArtisanTaskTimesheet {
    id: ID!
    tenantId: Int!
    workspace: TenantWorkspace!
    workspaceId: Int!
    artisan: TenantUser!
    artisanId: Int!
    startDate: DateTime!
    endDate: DateTime
    timeSpent: String
    rate: Float!
    rateType: RateType!
    productionOrder: ProductionOrder
    productionOrderId: Int
    rework: Boolean!
    productive: Boolean!
    reason: String
    created: DateTime!
    createdByUser: TenantUser!
    createdBy: Int!
    totalCost: Float!
    timeSpentInHours: Float!
    customFields: ArtisanTaskTimesheetCustomFields!
  }

  type ArtisanTaskTimesheetStatistics {
    totalHours: Float!
    totalCost: Float!
    productiveHours: Float!
    reworkHours: Float!
    nonProductiveHours: Float!
  }

  type ArtisanProductivityReport {
    artisan: TenantUser!
    totalHours: Float!
    productiveHours: Float!
    reworkHours: Float!
    nonProductiveHours: Float!
    efficiency: Float!
  }

  enum RateType {
    HOURLY
    DAILY
  }

  # Add at least one field to make the type valid
  type ArtisanTaskTimesheetCustomFields {
    _dummy: String
  }

  input CreateArtisanTaskTimesheetInput {
    tenantId: Int!
    workspaceId: Int!
    artisanId: Int!
    startDate: DateTime!
    endDate: DateTime
    rate: Float!
    rateType: RateType!
    productionOrderId: Int
    rework: Boolean
    productive: Boolean
    reason: String
    createdBy: Int!
    customFields: ArtisanTaskTimesheetCustomFieldsInput
  }

  input UpdateArtisanTaskTimesheetInput {
    id: ID!
    workspaceId: Int
    artisanId: Int
    startDate: DateTime
    endDate: DateTime
    rate: Float
    rateType: RateType
    productionOrderId: Int
    rework: Boolean
    productive: Boolean
    reason: String
    customFields: ArtisanTaskTimesheetCustomFieldsInput
  }

  input StopArtisanTaskTimesheetInput {
    id: ID!
    endDate: DateTime!
  }

  # Add at least one field to make the input type valid
  input ArtisanTaskTimesheetCustomFieldsInput {
    _dummy: String
  }

  input ArtisanTaskTimesheetListOptions {
    skip: Int
    take: Int
  }

  type ArtisanTaskTimesheetList {
    items: [ArtisanTaskTimesheet!]!
    totalItems: Int!
  }
`;
