export const PRODUCTION_ORDER_PLUGIN_OPTIONS = Symbol(
  "PRODUCTION_ORDER_PLUGIN_OPTIONS"
);
export const loggerCtx = "ProductionOrderPlugin";


export enum ProductionOrderType {
  ALTERATION = "ALTERATION",
  PRODUCTION = "PRODUCTION",
  SAMPLE = "SAMPLE",
}

export enum ProductionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_QC = "READY_FOR_QC",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
  ON_HOLD = "ON_HOLD",
}
