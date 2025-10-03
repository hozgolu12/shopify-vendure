import { CustomFieldConfig, LanguageCode } from "@vendure/core";

export const locationSchema: CustomFieldConfig = {
  name: "location",
  type: "struct",
  fields: [
    { name: "id", type: "string" },
    { name: "companyIds", type: "string" },
    { name: "sameAsBilling", type: "boolean" },
    { name: "locationName", type: "string" },
    { name: "locationAddress", type: "string" },
    { name: "locationCountry", type: "string" },
    { name: "locationState", type: "string" },
    { name: "locationCity", type: "string" },
    { name: "locationZip", type: "string" },
    { name: "locationTaxId", type: "string" },
    {
      name: "locationType",
      type: "string",
      options: [
        {
          value: "sales",
          label: [{ languageCode: LanguageCode.en, value: "Sales" }],
        },
        {
          value: "warehouse",
          label: [{ languageCode: LanguageCode.en, value: "Warehouse" }],
        },
        {
          value: "manufacturing",
          label: [{ languageCode: LanguageCode.en, value: "Manufacturing" }],
        },
        {
          value: "backOffice",
          label: [{ languageCode: LanguageCode.en, value: "Back Office" }],
        },
      ],
    },
  ],
};
