import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeId: string;

  @Column()
  groupName: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  values: string[];

  @ManyToOne(() => TenantInventory, (inventory) => inventory.attributes)
  inventory: TenantInventory;
}
