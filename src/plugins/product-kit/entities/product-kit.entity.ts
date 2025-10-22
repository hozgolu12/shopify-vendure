import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
  Unique,
} from "typeorm";
import {
  DeepPartial,
  VendureEntity,
  HasCustomFields,
  ID,
  ProductVariant,
  Channel,
  Collection,
} from "@vendure/core";
import { ProductKitCustomFields } from "./product-kit-custom-fields.entity";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

// Unique constraint to prevent duplicate product kits in the same channel
@Entity()
@Unique("UQ_product_kit_channel_barcode", ["barcode", "channelId"])
@Unique("UQ_product_kit_channel_name", ["itemKitName", "channelId"])
export class ProductKit extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barcode: string;

  @Column()
  itemKitName: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
  })
  discountType: DiscountType;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  discountValue: number;

  @ManyToMany(() => ProductVariant)
  @JoinTable({
    name: "product_kit_variants",
    joinColumn: { name: "productKitId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "productVariantId", referencedColumnName: "id" },
  })
  productVariants: ProductVariant[];

  @Column("integer", { nullable: false })
  productKitPrice: number;

  @ManyToOne(() => ProductVariant, { nullable: false })
  @JoinColumn({ name: "primaryProductId" })
  primaryProduct: ProductVariant;

  @Column()
  primaryProductId: number;

  // Many-to-One relationship with Channel
  @ManyToOne(() => Channel, { nullable: false })
  @JoinColumn({ name: "channelId" })
  channel: Channel;

  @Column()
  channelId: number;

  @ManyToOne(() => Collection, { nullable: false })
  @JoinColumn({ name: "collectionId" })
  collection: Collection;

  @Column()
  collectionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column((type) => ProductKitCustomFields)
  customFields: ProductKitCustomFields;

  constructor(input?: DeepPartial<ProductKit>) {
    super(input);
  }
}
