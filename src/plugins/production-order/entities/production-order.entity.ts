import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  DeepPartial,
  VendureEntity,
  HasCustomFields,
  ID,
  Customer,
} from "@vendure/core";
import { ProductionOrderCustomFields } from "./production-order-custom-fields.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";

export enum ProductionOrderType {
  ALTERATION = "ALTERATION",
  MTO = "MADE-TO-ORDER",
  CUSTOM = "CUSTOM",
}

export enum ProductionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_QC = "READY_FOR_QC",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ON_HOLD = "ON_HOLD",
}

@Entity()
export class ProductionOrder extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  // Tenant/Channel relationship
  @Column()
  tenantId: number;

  // Workspace relationship
  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace: Workspace;

  @Column()
  workspaceId: number;

  // Customer relationship
  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @Column()
  customerId: number;

  // Order type
  @Column({
    type: "enum",
    enum: ProductionOrderType,
    default: ProductionOrderType.MTO,
  })
  orderType: ProductionOrderType;

  // Group information (for bulk orders)
  @Column({ nullable: true })
  groupId: number;

  @Column("text", { nullable: true })
  groupTitle: string;

  // Item information
  @Column("text")
  itemCode: string;

  @Column("text")
  itemTitle: string;

  // Status
  @Column({
    type: "enum",
    enum: ProductionStatus,
    default: ProductionStatus.DRAFT,
  })
  status: ProductionStatus;

  // Item configuration (JSON)
  @Column("simple-json")
  itemConfig: any;

  // Audit fields
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "createdBy" })
  createdByUser: TenantUser;

  @Column()
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "updatedBy" })
  updatedByUser: TenantUser;

  @Column()
  updatedBy: number;

  @Column((type) => ProductionOrderCustomFields)
  customFields: ProductionOrderCustomFields;

  constructor(input?: DeepPartial<ProductionOrder>) {
    super(input);
  }
}
