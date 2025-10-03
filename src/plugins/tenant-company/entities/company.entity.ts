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
import { DeepPartial } from "@vendure/core";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { TenantCompanyDetails } from "./company-details.entity";
import { TenantCompanyLocation } from "./company-location.entity";
import { TenantWorkspace } from "./workspace.entity";

@Entity()
export class BesPosCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TenantUser, (user) => user.companies)
  @JoinColumn({ name: "userId" })
  user: TenantUser;

  @Column()
  userId: number;

  @Column((type) => TenantCompanyDetails)
  companyDetails: TenantCompanyDetails;

  @OneToMany(() => TenantCompanyLocation, (location) => location.company, {
    cascade: true,
    eager: true,
  })
  locations: TenantCompanyLocation[];

  @OneToMany(() => TenantWorkspace, (workspace) => workspace.company, {
    cascade: true,
    eager: true,
  })
  workspaces: TenantWorkspace[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(input?: DeepPartial<BesPosCompany>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
}
