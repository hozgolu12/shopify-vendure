import gql from "graphql-tag";

export const schema = gql`
  extend type Query {
    besPosCompany(id: ID!): BesPosCompany
    besPosCompanyByUserId(userId: ID!): BesPosCompany
    besPosCompanies: [BesPosCompany!]!
    myBesPosCompany: BesPosCompany
  }

  extend type Mutation {
    createBesPosCompany(input: CreateBesPosCompanyInput!): BesPosCompany!
    updateBesPosCompany(input: UpdateBesPosCompanyInput!): BesPosCompany!
    upsertBesPosCompany(input: UpsertBesPosCompanyInput!): BesPosCompany!
    addLocationToBesPosCompany(
      companyId: ID!
      location: TenantLocationInput!
    ): BesPosCompany!
  }

  type BesPosCompany {
    id: ID!
    user: TenantUser!
    companyDetails: TenantCompanyDetails!
    locations: [TenantCompanyLocation!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TenantCompanyDetails {
    orgName: String!
    orgAddress: String!
    orgPhone: String!
    taxId: String
    website: String
    socials: TenantSocials
  }

  type TenantSocials {
    platform: String!
    handle: String!
  }

  type TenantCompanyLocation {
    id: ID!
    sameAsBilling: Boolean!
    locationName: String
    locationAddress: String
    locationCountry: String
    locationState: String
    locationCity: String
    locationZipcode: Int
    locationTaxId: String
    locationTypes: TenantLocationTypes!
  }

  type TenantLocationTypes {
    sales: Boolean!
    warehouse: Boolean!
    manufacturing: Boolean!
    backOffice: Boolean!
    custom: JSON
  }

  input CreateBesPosCompanyInput {
    userId: ID!
    companyDetails: TenantCompanyDetailsInput!
    locations: [TenantLocationInput!]
  }

  input UpdateBesPosCompanyInput {
    id: ID!
    companyDetails: TenantCompanyDetailsInput
  }

  input UpsertBesPosCompanyInput {
    userId: ID!
    companyDetails: TenantCompanyDetailsInput!
    locations: [TenantLocationInput!]
  }

  input TenantCompanyDetailsInput {
    orgName: String!
    orgAddress: String!
    orgPhone: String!
    taxId: String
    website: String
    socials: TenantSocialsInput
  }

  input TenantSocialsInput {
    platform: String!
    handle: String!
  }

  input TenantLocationInput {
    sameAsBilling: Boolean
    locationName: String
    locationAddress: String
    locationCountry: String
    locationState: String
    locationCity: String
    locationZipcode: Int
    locationTaxId: String
    locationTypes: TenantLocationTypesInput!
  }

  input TenantLocationTypesInput {
    sales: Boolean
    warehouse: Boolean
    manufacturing: Boolean
    backOffice: Boolean
    custom: JSON
  }
`;
