import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class RegularAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  regularAttributeId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  properties: string[];

  @Column({ nullable: true })
  group: string;

  @Column({ nullable: true })
  parent: string;

  @Column({ nullable: true })
  abbreviation: string;

  @ManyToOne(() => TenantInventory, (inventory) => inventory.regularAttributes)
  inventory: TenantInventory;
}
