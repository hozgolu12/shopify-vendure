import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { Workspace } from "./entities/tenant-workspace.entity";
import { MeasurementField } from "./entities/tenant-measurement.entity";
import { WorkspaceService } from "./services/tenant-workspace.service";
import { WorkspaceResolver } from "./api/tenant-workspace-admin.resolver"; // Updated import
import { schema } from "./api/api-extensions";

export interface WorkspacePluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Workspace, MeasurementField],
  providers: [WorkspaceService],
  adminApiExtensions: {
    schema,
    resolvers: [WorkspaceResolver], // Use the correct resolver
  },
  shopApiExtensions: {
    schema,
    resolvers: [WorkspaceResolver], // Use the correct resolver
  },
  compatibility: "^3.0.0",
})
export class WorkspacePlugin {
  static options: WorkspacePluginOptions;

  static init(options: WorkspacePluginOptions = {}): Type<WorkspacePlugin> {
    this.options = options;
    return WorkspacePlugin;
  }
}
