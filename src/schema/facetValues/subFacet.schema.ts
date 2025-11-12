import { CustomFieldConfig } from "@vendure/core";

export const subFacetSchema: CustomFieldConfig = {
  name: "subFacet",
  type: "string",
  list: true,
  public: true,
  nullable: true,
};
