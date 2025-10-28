import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ArtisanTaskTimesheet } from "./entities/artisans-task-timesheet.entity";
import { ArtisanTaskTimesheetCustomFields } from "./entities/artisans-task-timesheet-custom-fields.entity";
import { ArtisanTaskTimesheetService } from "./services/artisans-task-timesheet.service";
import { ArtisanTaskTimesheetResolver } from "./api/artisans-task-timesheet-admin.resolver";
import { schema } from "./api/api-extensions";

export interface ArtisanTaskTimesheetPluginOptions {
  // Plugin-specific options can be added here
}

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ArtisanTaskTimesheet, ArtisanTaskTimesheetCustomFields],
  providers: [ArtisanTaskTimesheetService],
  adminApiExtensions: {
    schema,
    resolvers: [ArtisanTaskTimesheetResolver],
  },
  shopApiExtensions: {
    schema,
    resolvers: [ArtisanTaskTimesheetResolver],
  },
  compatibility: "^3.0.0",
})
export class ArtisanTaskTimesheetPlugin {
  static options: ArtisanTaskTimesheetPluginOptions;

  static init(
    options: ArtisanTaskTimesheetPluginOptions = {}
  ): Type<ArtisanTaskTimesheetPlugin> {
    this.options = options;
    return ArtisanTaskTimesheetPlugin;
  }
}
