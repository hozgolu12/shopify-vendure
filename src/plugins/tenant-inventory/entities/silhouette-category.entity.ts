import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TenantInventory } from "./tenant-inventory.entity";

@Entity()
export class SilhouetteCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  silhouetteId: string;

  @Column()
  name: string;

  @Column()
  enabled: boolean;

  @Column("simple-json")
  silhouetteTypes: string[];

  @ManyToOne(
    () => TenantInventory,
    (inventory) => inventory.silhouetteCategories
  )
  inventory: TenantInventory;
}
