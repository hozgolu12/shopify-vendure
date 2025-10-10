import { CustomFieldConfig } from "@vendure/core";

export const productTypeSchema: CustomFieldConfig = {
  name: "productType",
  type: "struct",
  list: true,
  fields: [
    { name: "rawMaterial", type: "boolean" },
    { name: "salable", type: "boolean" },
  ],
};
