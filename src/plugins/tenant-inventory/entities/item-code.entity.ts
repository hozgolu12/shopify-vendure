import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class ItemCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json")
  itemCodeAttributes: string[];

  @Column("simple-json")
  itemNameAttributes: string[];

  @Column()
  delimiter: string;

  @Column()
  itemCode: string;

  @Column()
  itemName: string;

  @ManyToOne(() => TenantInventory, (inventory) => inventory.itemCode)
  inventory: TenantInventory;
}
