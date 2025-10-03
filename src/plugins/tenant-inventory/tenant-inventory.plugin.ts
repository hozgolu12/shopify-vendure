import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { TenantInventory } from "./entities/tenant-inventory.entity";
import { SilhouetteCategory } from "./entities/silhouette-category.entity";
import { Modifier } from "./entities/modifier.entity";
import { Attribute } from "./entities/attribute.entity";
import { Embellishment } from "./entities/embellishment.entity";
import { Motif } from "./entities/motif.entity";
import { TrimClosure } from "./entities/trim-closure.entity";
import { RegularAttribute } from "./entities/regular-attribute.entity";
import { ItemCode } from "./entities/item-code.entity";
import { TenantInventoryService } from "./services/tenant-inventory.service";
import { TenantInventoryAdminResolver } from "./api/inventory-admin.resolver";
import { schema } from "./api/api-extensions";

export interface TenantInventoryPluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    TenantInventory,
    SilhouetteCategory,
    Modifier,
    Attribute,
    Embellishment,
    Motif,
    TrimClosure,
    RegularAttribute,
    ItemCode,
  ],
  providers: [TenantInventoryService],
  adminApiExtensions: {
    schema,
    resolvers: [TenantInventoryAdminResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [TenantInventoryAdminResolver],
  },
  compatibility: "^3.0.0",
})
export class TenantInventoryPlugin {
  static options: TenantInventoryPluginOptions;

  static init(
    options: TenantInventoryPluginOptions = {}
  ): Type<TenantInventoryPlugin> {
    this.options = options;
    return TenantInventoryPlugin;
  }
}
