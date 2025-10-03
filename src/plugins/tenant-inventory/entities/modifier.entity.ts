import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modifierId: string;

  @Column()
  groupName: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  modifiers: string[];

  @ManyToOne(() => TenantInventory, (inventory) => inventory.modifiers)
  inventory: TenantInventory;
}
