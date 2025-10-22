import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ProductionOrderTask } from "./entities/production-order-task.entity";
import { ProductionOrderTaskCustomFields } from "./entities/production-order-task-custom-fields.entity";
import { ProductionOrderTaskService } from "./services/production-order-task.service";
import { ProductionOrderTaskResolver } from "./api/production-order-task-admin.resolver";
import { schema } from "./api/api-extensions";

export interface ProductionOrderTaskPluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductionOrderTask, ProductionOrderTaskCustomFields],
  providers: [ProductionOrderTaskService],
  adminApiExtensions: {
    schema,
    resolvers: [ProductionOrderTaskResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [ProductionOrderTaskResolver],
  },
  compatibility: "^3.0.0",
})
export class ProductionOrderTaskPlugin {
  static options: ProductionOrderTaskPluginOptions;

  static init(
    options: ProductionOrderTaskPluginOptions = {}
  ): Type<ProductionOrderTaskPlugin> {
    this.options = options;
    return ProductionOrderTaskPlugin;
  }
}
