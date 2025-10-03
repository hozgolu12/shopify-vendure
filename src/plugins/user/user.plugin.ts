import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { TenantUser } from "./entities/user.entity";
import { UserService } from "./services/user.service";
import { UserResolver } from "./api/user-admin.resolver";
import { schema } from "./api/api-extensions";

export interface UserPluginOptions {
  // Add any plugin-specific options here
}

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
  configuration: (config) => {
    // Plugin-specific configuration
    // Custom fields are already configured in vendure-config.ts
    // This plugin supports the TenantUser custom fields:
    // - companySchema: company information
    // - locationSchema: location details
    // - workspaceSchema: workspace information
    return config;
  },
  compatibility: "^3.0.0",
})
export class UserPlugin {
  static options: UserPluginOptions;

  static init(options: UserPluginOptions = {}): Type<UserPlugin> {
    this.options = options;
    return UserPlugin;
  }
}
