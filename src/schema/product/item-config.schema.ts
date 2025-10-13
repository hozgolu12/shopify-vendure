import { CustomFieldConfig } from "@vendure/core";

export const itemConfigSchema: CustomFieldConfig = {
  name: "itemConfig",
  type: "text",
  list: false,
  public: true,
  nullable: true,
  ui: { component: "json-editor-form-input" },
  //   requiresPermission: "Product",
};
