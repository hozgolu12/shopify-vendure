import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { DeepPartial } from "@vendure/core";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { TenantCompanyDetails } from "./company-details.entity";
import { TenantCompanyLocation } from "./company-location.entity";

@Entity()
export class TenantCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TenantUser, (user) => user.company)
  user: TenantUser;

  @Column((type) => TenantCompanyDetails)
  companyDetails: TenantCompanyDetails;

  @OneToMany(() => TenantCompanyLocation, (location) => location.company, {
    cascade: true,
    eager: true,
  })
  locations: TenantCompanyLocation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(input?: DeepPartial<TenantCompany>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
}
