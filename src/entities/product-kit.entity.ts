import { DeepPartial, VendureEntity } from "@vendure/core";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "@vendure/core"; // Import the built-in Product entity

@Entity()
export class ProductKit extends VendureEntity {
  constructor(input?: DeepPartial<ProductKit>) {
    super(input);
  }

  @Column()
  productKitName: string;

  @Column("decimal", { precision: 10, scale: 2 }) // Use 'decimal' for float-like precision
  price: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
