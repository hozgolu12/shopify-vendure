import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields } from "@vendure/core";
import { TenantUser } from "../../user/entities/user.entity";
import { TenantInventoryCustomFields } from "./tenant-inventory-custom-fields.entity";
import { SilhouetteCategory } from "./silhouette-category.entity";
import { Modifier } from "./modifier.entity";
import { Attribute } from "./attribute.entity";
import { Embellishment } from "./embellishment.entity";
import { Motif } from "./motif.entity";
import { TrimClosure } from "./trim-closure.entity";
import { RegularAttribute } from "./regular-attribute.entity";
import { ItemCode } from "./item-code.entity";

@Entity()
export class TenantInventory extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TenantUser, (user) => user.inventories)
  @JoinColumn({ name: "userId" })
  user: TenantUser;

  @Column()
  userId: number;

  @Column({ nullable: true })
  workspaceId: string;

  // Categories section
  @Column("simple-json")
  productRegions: string[];

  @OneToMany(() => SilhouetteCategory, (silhouette) => silhouette.inventory, {
    cascade: true,
    eager: true,
  })
  silhouetteCategories: SilhouetteCategory[];

  @OneToMany(() => Modifier, (modifier) => modifier.inventory, {
    cascade: true,
    eager: true,
  })
  modifiers: Modifier[];

  @OneToMany(() => Attribute, (attribute) => attribute.inventory, {
    cascade: true,
    eager: true,
  })
  attributes: Attribute[];

  @OneToMany(() => Embellishment, (embellishment) => embellishment.inventory, {
    cascade: true,
    eager: true,
  })
  embellishments: Embellishment[];

  @OneToMany(() => Motif, (motif) => motif.inventory, {
    cascade: true,
    eager: true,
  })
  motifs: Motif[];

  @OneToMany(() => TrimClosure, (trimClosure) => trimClosure.inventory, {
    cascade: true,
    eager: true,
  })
  trimsClosures: TrimClosure[];

  // Attributes section
  @OneToMany(
    () => RegularAttribute,
    (regularAttribute) => regularAttribute.inventory,
    { cascade: true, eager: true }
  )
  regularAttributes: RegularAttribute[];

  // Item Code section
  @OneToOne(() => ItemCode, { cascade: true, eager: true })
  @JoinColumn()
  itemCode: ItemCode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column((type) => TenantInventoryCustomFields)
  customFields: TenantInventoryCustomFields;

  constructor(input?: DeepPartial<TenantInventory>) {
    super(input);
  }
}
