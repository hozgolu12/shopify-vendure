import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { schema } from "./api/api-extensions";
import { ShopifyAdminResolver } from "./api/shopify-admin.resolver";
import { TenantShopifySettings } from "./entities/tenant-shopify-settings.entity";
import { ShopifyService } from "./services/shopify.service";

export interface ShopifyIntegrationPluginOptions {
  /* future plugin options */
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [TenantShopifySettings],
  providers: [ShopifyService],
  adminApiExtensions: {
    schema,
    resolvers: [ShopifyAdminResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [ShopifyAdminResolver],
  },
  compatibility: "^3.0.0",
})
export class ShopifyIntegrationPlugin {
  static options: ShopifyIntegrationPluginOptions;

  static init(options: ShopifyIntegrationPluginOptions = {}): Type<ShopifyIntegrationPlugin> {
    this.options = options;
    return ShopifyIntegrationPlugin;
  }

  static ui: AdminUiExtension = {
    id: "shopify-integration-ui",
    extensionPath: path.join(__dirname, "ui"),
    routes: [{ route: "shopify-integration", filePath: "routes.ts" }],
    providers: ["providers.ts"],
  };
}
