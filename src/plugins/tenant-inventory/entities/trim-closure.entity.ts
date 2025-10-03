import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class TrimClosure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trimClosureId: string;

  @Column()
  groupName: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  values: string[];

  @ManyToOne(() => TenantInventory, (inventory) => inventory.trimsClosures)
  inventory: TenantInventory;
}
