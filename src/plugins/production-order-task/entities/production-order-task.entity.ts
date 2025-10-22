import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields, ID } from "@vendure/core";
import { ProductionOrderTaskCustomFields } from "./production-order-task-custom-fields.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductionOrder } from "../../production-order/entities/production-order.entity";
import { TaskStatus } from "../types";

@Entity()
export class ProductionOrderTask
  extends VendureEntity
  implements HasCustomFields
{
  @PrimaryGeneratedColumn()
  id: number;

  // Self-referencing parent relationship for sub-tasks
  @ManyToOne(() => ProductionOrderTask, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent: ProductionOrderTask;

  @Column({ nullable: true })
  parentId: number;

  // Tenant/Channel relationship
  @Column()
  tenantId: number;

  // Workspace relationship
  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace: Workspace;

  @Column()
  workspaceId: number;

  // Production Order relationship
  @ManyToOne(() => ProductionOrder)
  @JoinColumn({ name: "productionOrderId" })
  productionOrder: ProductionOrder;

  @Column()
  productionOrderId: number;

  // Status
  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  // Dates
  @Column({ type: "timestamp with time zone", nullable: true })
  startDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  endDate: Date;

  // Assignees (JSON array of user IDs)
  @Column("simple-json", { nullable: true })
  assignees: number[];

  // Supervisor relationship
  @ManyToOne(() => TenantUser, { nullable: true })
  @JoinColumn({ name: "supervisor" })
  supervisorUser: TenantUser;

  @Column({ nullable: true })
  supervisor: number;

  // Dependencies (JSON array of task IDs)
  @Column("simple-json", { nullable: true })
  dependencies: number[];

  // Remarks
  @Column("text", { nullable: true })
  remarks: string;

  // Audit fields
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "createdBy" })
  createdByUser: TenantUser;

  @Column()
  createdBy: number;

  @Column((type) => ProductionOrderTaskCustomFields)
  customFields: ProductionOrderTaskCustomFields;

  // Self-referencing for sub-tasks
  @OneToMany(() => ProductionOrderTask, (task) => task.parent)
  subTasks: ProductionOrderTask[];

  constructor(input?: DeepPartial<ProductionOrderTask>) {
    super(input);
  }
}
