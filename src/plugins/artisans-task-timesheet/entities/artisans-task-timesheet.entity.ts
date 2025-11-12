import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields, ID } from "@vendure/core";
import { ArtisanTaskTimesheetCustomFields } from "./artisans-task-timesheet-custom-fields.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductionOrder } from "../../production-order/entities/production-order.entity";

@Entity()
export class ArtisanTaskTimesheet
  extends VendureEntity
  implements HasCustomFields
{
  @PrimaryGeneratedColumn()
  id: number;

  // Tenant/Channel relationship
  @Column()
  tenantId: number;

  @Column({ type: "text", nullable: true })
  tenantMongoId: string;

  // Workspace relationship
  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace: Workspace;

  @Column()
  workspaceId: number;

  @Column({ nullable: true, select: false })
  workspaceMongoId?: string;

  // Artisan relationship (User)
  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "artisanId" })
  artisan: TenantUser;

  @Column()
  artisanId: number;

  @Column({ nullable: true, select: false })
  artisanMongoId?: string;

  // Time tracking
  @Column({ type: "timestamp with time zone", nullable: true })
  startDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  endDate: Date;

  // Time spent (calculated automatically)
  @Column({ type: "time", nullable: true })
  timeSpent: string;

  // Rate information
  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  rate: number;

  @Column({
    type: "enum",
    enum: ["hourly", "daily"],
    default: "hourly",
  })
  rateType: "hourly" | "daily";

  // Production Order relationship
  @ManyToOne(() => ProductionOrder, { nullable: true })
  @JoinColumn({ name: "productionOrderId" })
  productionOrder: ProductionOrder;

  @Column({ nullable: true })
  productionOrderId: number;

  // Work classification
  @Column({ default: false })
  rework: boolean;

  @Column({ default: true })
  productive: boolean;

  // Reason for non-productive work
  @Column("text", { nullable: true })
  reason: string;

  // Workstation
  @Column({ nullable: true })
  workstation: string;

  // Audit fields
  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "createdBy" })
  createdByUser: TenantUser;

  @Column()
  createdBy: number;

  @Column({ nullable: true, select: false })
  createdByMongoId?: string;

  @Column((type) => ArtisanTaskTimesheetCustomFields)
  customFields: ArtisanTaskTimesheetCustomFields;

  constructor(input?: DeepPartial<ArtisanTaskTimesheet>) {
    super(input);
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateReworkAndProductive() {
    // Validation: If rework is true, productive must be true
    if (this.rework === true && this.productive === false) {
      throw new Error("If rework is true, productive must be true");
    }

    // Validation: If productive is false, rework must be false
    if (this.productive === false && this.rework === true) {
      throw new Error("If productive is false, rework must be false");
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  calculateTimeSpent() {
    // Calculate time spent only if both start and end dates are provided
    if (this.startDate && this.endDate) {
      console.log("startDate", this.startDate);
      console.log("endDate", this.endDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      // Ensure end date is after start date
      if (end <= start) {
        throw new Error("End date must be after start date");
      }

      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      // Format as HH:MM:SS
      this.timeSpent = `${diffHours.toString().padStart(2, "0")}:${diffMinutes
        .toString()
        .padStart(2, "0")}:00`;
    } else if (this.endDate === null) {
      // If end date is not set, clear timeSpent
      this.timeSpent = "";
    }
  }

  // Helper method to get time spent in hours (decimal)
  getTimeSpentInHours(): number {
    if (!this.timeSpent) return 0;

    const [hours, minutes] = this.timeSpent.split(":").map(Number);
    return hours + minutes / 60;
  }

  // Helper method to calculate total cost
  calculateTotalCost(): number {
    const timeSpentHours = this.getTimeSpentInHours();

    if (this.rateType === "hourly") {
      return this.rate * timeSpentHours;
    } else if (this.rateType === "daily") {
      const days = timeSpentHours / 8; // Assuming 8-hour work day
      return this.rate * days;
    }

    return 0;
  }
}
