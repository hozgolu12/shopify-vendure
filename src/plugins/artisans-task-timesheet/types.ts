import { ArtisanTaskTimesheet } from "./entities/artisans-task-timesheet.entity";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
  exampleOption?: string;
}

/**
 * @description
 * Represents an ArtisanTaskTimesheet with calculated fields for GraphQL responses
 */
export type ArtisanTaskTimesheetWithCalculatedFields = Omit<
  ArtisanTaskTimesheet,
  | "validateReworkAndProductive"
  | "calculateTimeSpent"
  | "getTimeSpentInHours"
  | "calculateTotalCost"
> & {
  totalCost: number;
  timeSpentInHours: number;
};
