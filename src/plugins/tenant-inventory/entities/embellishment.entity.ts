import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class Embellishment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  embellishmentId: string;

  @Column()
  groupName: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  values: string[];

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => TenantInventory, (inventory) => inventory.embellishments)
  inventory: TenantInventory;
}
