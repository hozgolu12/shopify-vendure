import { CustomFieldConfig } from "@vendure/core";

export const workspaceSchema: CustomFieldConfig = {
  name: "workspace",
  type: "struct",
  list: true,
  fields: [
    { name: "id", type: "string" },
    { name: "workspaceName", type: "string" },
    { name: "productLine", type: "string" },
    { name: "companyIds", type: "string" },
  ],
};
