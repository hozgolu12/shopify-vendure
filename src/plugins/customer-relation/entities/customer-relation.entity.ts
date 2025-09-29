import { DeepPartial, EntityId, ID, VendureEntity } from "@vendure/core";
import { Customer } from "@vendure/core"; // Built-in Customer entity
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Relation extends VendureEntity {
  constructor(input?: DeepPartial<Relation>) {
    super(input);
  }

  @ManyToOne(() => Customer)
  fromCustomer: Customer;

  @EntityId()
  fromCustomerId: ID;

  @ManyToOne(() => Customer)
  toCustomer: Customer;

  @EntityId()
  toCustomerId: ID;

  @Column()
  type: string; // e.g., "father", "son", "mother", "friend"
}
