import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    tenantWorkspace(id: ID!): TenantWorkspace
    tenantWorkspaces(options: TenantWorkspaceListOptions): TenantWorkspaceList!
    tenantWorkspacesByUserId(userId: ID!): [TenantWorkspace!]!
    tenantWorkspacesByOrganizationId(
      organizationId: String!
    ): [TenantWorkspace!]!
  }

  extend type Mutation {
    createTenantWorkspace(input: CreateTenantWorkspaceInput!): TenantWorkspace!
    updateTenantWorkspace(input: UpdateTenantWorkspaceInput!): TenantWorkspace!
    deleteTenantWorkspace(id: ID!): DeletionResponse!
    addMeasurementFieldToWorkspace(
      workspaceId: ID!
      measurementField: MeasurementFieldInput!
    ): TenantWorkspace!
    removeMeasurementFieldFromWorkspace(measurementFieldId: ID!): Boolean!
  }

  type TenantWorkspace {
    id: ID!
    user: TenantUser!
    userId: ID!
    organizationId: String
    workspaceName: String!
    productLine: String!
    statuses: [String!]!
    workstations: [String!]!
    sizeSystems: [String!]!
    measurementFields: [MeasurementField!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    customFields: TenantWorkspaceCustomFields!
  }

  type MeasurementField {
    id: ID!
    fieldName: String!
    selectedValues: [String!]!
  }

  # Add at least one field to make the type valid
  type TenantWorkspaceCustomFields {
    _dummy: String
  }

  input CreateTenantWorkspaceInput {
    userId: ID!
    organizationId: String
    workspaceName: String!
    productLine: String!
    statuses: [String!]!
    workstations: [String!]!
    sizeSystems: [String!]!
    measurementFields: [MeasurementFieldInput!]
    customFields: TenantWorkspaceCustomFieldsInput
  }

  input UpdateTenantWorkspaceInput {
    id: ID!
    organizationId: String
    workspaceName: String
    productLine: String
    statuses: [String!]
    workstations: [String!]
    sizeSystems: [String!]
    measurementFields: [MeasurementFieldInput!]
    customFields: TenantWorkspaceCustomFieldsInput
  }

  input MeasurementFieldInput {
    fieldName: String!
    selectedValues: [String!]!
  }

  # Add at least one field to make the input type valid
  input TenantWorkspaceCustomFieldsInput {
    _dummy: String
  }

  input TenantWorkspaceListOptions {
    skip: Int
    take: Int
  }

  type TenantWorkspaceList {
    items: [TenantWorkspace!]!
    totalItems: Int!
  }
`;
