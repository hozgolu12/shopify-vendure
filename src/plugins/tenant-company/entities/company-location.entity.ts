import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { BesPosCompany } from "./company.entity";

@Entity()
export class TenantCompanyLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  sameAsBilling: boolean;

  @Column({ length: 100, nullable: true })
  locationName: string;

  @Column({ length: 200, nullable: true })
  locationAddress: string;

  @Column({ length: 50, nullable: true })
  locationCountry: string;

  @Column({ length: 50, nullable: true })
  locationState: string;

  @Column({ length: 50, nullable: true })
  locationCity: string;

  @Column({ type: "int", nullable: true })
  locationZipcode: number;

  @Column({ length: 50, nullable: true })
  locationTaxId: string;

  @Column({ type: "json" })
  locationTypes: {
    sales: boolean;
    warehouse: boolean;
    manufacturing: boolean;
    backOffice: boolean;
    [key: string]: boolean;
  };

  @ManyToOne(() => BesPosCompany, (company) => company.locations)
  company: BesPosCompany;
}
