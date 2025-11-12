export interface ShopifyIntegrationPluginOptions {
  /* Optional global plugin options */
}

export interface ShopifySettingsInput {
  tenantId: number;
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
  accessToken?: string;
}
