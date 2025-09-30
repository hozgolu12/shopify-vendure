import { CustomFieldConfig } from "@vendure/core";

export const orderKitsSchema: CustomFieldConfig = {
  name: "orderKits",
  type: "struct",
  list: true,
  fields: [
    { name: "id", type: "string" },
    { name: "orderKitName", type: "string" },
    {
      name: "orderIds",
      type: "string",
      list: true,
    },
  ],
};
