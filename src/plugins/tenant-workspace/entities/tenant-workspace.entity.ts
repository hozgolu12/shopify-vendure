import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields } from "@vendure/core";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { WorkspaceCustomFields } from "./tenant-workspace-customFields.entity";
import { MeasurementField } from "./tenant-measurement.entity";

@Entity()
export class Workspace extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TenantUser, (user) => user.workspaces)
  @JoinColumn({ name: "userId" })
  user: TenantUser;

  @Column()
  userId: number;

  @Column({ nullable: true })
  organizationId: string;

  @Column()
  workspaceName: string;

  @Column()
  productLine: string;

  @Column("simple-json")
  statuses: string[];

  @Column("simple-json")
  workstations: string[];

  @Column("simple-json")
  sizeSystems: string[];

  @OneToMany(
    () => MeasurementField,
    (measurementField) => measurementField.workspace,
    { cascade: true, eager: true }
  )
  measurementFields: MeasurementField[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column((type) => WorkspaceCustomFields)
  customFields: WorkspaceCustomFields;

  constructor(input?: DeepPartial<Workspace>) {
    super(input);
  }
}
