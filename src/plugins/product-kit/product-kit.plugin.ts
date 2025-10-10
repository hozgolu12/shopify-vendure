import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ProductKit } from "./entities/product-kit.entity";
import { ProductKitCustomFields } from "./entities/product-kit-custom-fields.entity";
import { ProductKitService } from "./services/product-kit.service";
import { ProductKitResolver } from "./api/product-kit-admin.resolver";
import { schema } from "./api/api-extensions";

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
}
