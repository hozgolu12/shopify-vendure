import { CustomFieldConfig } from "@vendure/core";

export const productKitsSchema: CustomFieldConfig = {
  name: "productKits",
  type: "struct",
  list: true,
  fields: [
    { name: "id", type: "string" },
    { name: "productKitName", type: "string" },
    {
      name: "productIds",
      type: "string",
      list: true,
    },
    {
      name: "price",
      type: "float",
    },
  ],
};
