import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { BesPosCompany } from "./company.entity";

@Entity()
export class TenantWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  workspaceName: string;

  @Column({ length: 100 })
  productLine: string;

  @ManyToOne(() => BesPosCompany, (company) => company.workspaces)
  company: BesPosCompany;
}
