import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import * as path from 'path';
import { schema } from "./api/api-extensions";
import { ProductKitResolver } from "./api/product-kit-admin.resolver";
import { ProductKitCustomFields } from "./entities/product-kit-custom-fields.entity";
import { ProductKit } from "./entities/product-kit.entity";
import { ProductKitService } from "./services/product-kit.service";
export interface ProductKitPluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductKit, ProductKitCustomFields],
  providers: [ProductKitService],
  adminApiExtensions: {
    schema,
    resolvers: [ProductKitResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [ProductKitResolver],
  },
  compatibility: "^3.0.0",
})
export class ProductKitPlugin {
  static options: ProductKitPluginOptions;

  static init(options: ProductKitPluginOptions = {}): Type<ProductKitPlugin> {
    this.options = options;
    return ProductKitPlugin;
  }

    static ui: AdminUiExtension = {
        id: 'product-kit-ui',
        extensionPath: path.join(__dirname, 'ui'),
        routes: [{ route: 'product-kit', filePath: 'routes.ts' }],
        providers: ['providers.ts'],
    };
}
