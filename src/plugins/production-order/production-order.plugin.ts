import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ProductionOrder } from "./entities/production-order.entity";
import { ProductionOrderCustomFields } from "./entities/production-order-custom-fields.entity";
import { ProductionOrderService } from "./services/production-order.service";
import { ProductionOrderResolver } from "./api/production-order-admin.resolver";
import { schema } from "./api/api-extensions";

export interface ProductionOrderPluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductionOrder, ProductionOrderCustomFields],
  providers: [ProductionOrderService],
  adminApiExtensions: {
    schema,
    resolvers: [ProductionOrderResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [ProductionOrderResolver],
  },
  compatibility: "^3.0.0",
})
export class ProductionOrderPlugin {
  static options: ProductionOrderPluginOptions;

  static init(
    options: ProductionOrderPluginOptions = {}
  ): Type<ProductionOrderPlugin> {
    this.options = options;
    return ProductionOrderPlugin;
  }
}
