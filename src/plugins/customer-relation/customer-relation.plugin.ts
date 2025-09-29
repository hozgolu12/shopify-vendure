import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { Relation } from "./entities/customer-relation.entity";
import { RelationService } from "./services/customer-relation.service";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import {
  RelationAdminMutationResolver,
  RelationAdminResolver,
  RelationShopMutationResolver,
  RelationShopResolver,
} from "./api/customer-relation-admin.resolver";
import path from "path";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [RelationService],
  entities: [Relation],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [RelationShopResolver, RelationShopMutationResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [RelationAdminResolver, RelationAdminMutationResolver],
  },
  compatibility: "^3.0.0",
})
export class CustomerRelationPlugin {
  static ui = {
    extensionPath: path.join(__dirname, "ui"),
    routes: [{ route: "customer-relations", filePath: "routes.ts" }],
    providers: ["providers.ts"],
  };
}
