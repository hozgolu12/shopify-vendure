import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields } from "@vendure/core";
import { TenantInventory } from "../../tenant-inventory/entities/tenant-inventory.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";

export class TenantUserCustomFields {
  
}

@Entity()
export class TenantUser extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  betterAuthId: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyType: string;

  @Column({ nullable: true })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TenantInventory, (inventory) => inventory.user)
  inventories: TenantInventory[];

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];

  constructor(input?: DeepPartial<TenantUser>) {
    super(input);
  }

  @Column((type) => TenantUserCustomFields)
  customFields: TenantUserCustomFields;
}
