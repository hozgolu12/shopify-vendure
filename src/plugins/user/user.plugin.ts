import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { TenantUser } from "./entities/user.entity";
import { UserService } from "./services/user.service";
import { UserResolver } from "./api/user-admin.resolver";
import { schema } from "./api/api-extensions";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [TenantUser],
  providers: [UserService],
  adminApiExtensions: {
    schema,
    resolvers: [UserResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [UserResolver],
  },
})
export class UserPlugin {}
