import { CustomFieldConfig } from "@vendure/core";

export const companySchema: CustomFieldConfig = {
  name: "company",
  type: "struct",
  fields: [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "address", type: "string" },
    { name: "phone", type: "string" },
    { name: "email", type: "string" },
    { name: "website", type: "string" },
    { name: "socials", type: "string" },
    { name: "taxId", type: "string" },
    { name: "type", type: "string" },
    { name: "role", type: "string" },
    { name: "locationsIds", type: "string", list: true },
    { name: "workspacesIds", type: "string", list: true },
  ],
};
