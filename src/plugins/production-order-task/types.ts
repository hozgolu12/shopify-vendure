import { ID } from "@vendure/core";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
  exampleOption?: string;
}

export enum TaskStatus {
  TODO = "to do",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on hold",
  DONE = "done",
}

export interface CreateProductionOrderTaskInput {
  parentId?: number;
  tenantId: number;
  tenantMongoId: string;
  workspaceId: number;
  workspaceMongoId: string;
  productionOrderId: number;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  assignees?: number[];
  assigneesMongoId?: string[];
  supervisor?: number;
  supervisorMongoId?: string;
  dependencies?: number[];
  remarks?: string;
  createdBy: number;
  createdByMongoId: string;
  customFields?: any;
}

export interface UpdateProductionOrderTaskInput {
  id: ID;
  parentId?: number;
  workspaceId?: number;
  productionOrderId?: number;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  assignees?: number[];
  supervisor?: number;
  dependencies?: number[];
  remarks?: string;
  customFields?: any;
}

export interface UpdateTaskStatusInput {
  id: ID;
  status: TaskStatus;
}

export interface AssignTaskInput {
  id: ID;
  assignees: number[];
  supervisor?: number;
}
