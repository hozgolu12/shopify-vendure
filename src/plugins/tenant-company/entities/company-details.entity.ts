import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TenantCompanyDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  orgName: string;

  @Column({ length: 200 })
  orgAddress: string;

  @Column({ length: 20 })
  orgPhone: string;

  @Column({ length: 50, nullable: true })
  taxId: string;

  @Column({ length: 100, nullable: true })
  website: string;

  @Column({ type: "json", nullable: true })
  socials: {
    platform: string;
    handle: string;
  };
}
