import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import {
  DeepPartial,
  VendureEntity,
  HasCustomFields,
  ID,
  Customer,
  Order,
  ProductVariant,
} from "@vendure/core";
import { ProductionOrderCustomFields } from "./production-order-custom-fields.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductKit } from "../../product-kit/entities/product-kit.entity";
import { ProductionOrderType, ProductionStatus } from "../constants";

@Entity()
export class ProductionOrder extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  // Tenant/Channel relationship
  @Column()
  tenantId: number;

  // Workspace relationship
  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace: Workspace;

  @Column()
  workspaceId: number;

  // Vendure Order relationship
  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: "vendureOrderId" })
  vendureOrder: Order;

  @Column({ nullable: true })
  vendureOrderId: number;

  // Vendure Item relationship (ProductVariant)
  @ManyToMany(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: "vendureItemId" })
  vendureItem: ProductVariant;

  @Column({ nullable: true })
  vendureItemId: number;

  // Product Kit relationship
  @ManyToOne(() => ProductKit, { nullable: true })
  @JoinColumn({ name: "productKitId" })
  productKit: ProductKit;

  @Column({ nullable: true })
  productKitId: number;

  // Customer relationship
  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @Column()
  customerId: number;

  // Order type
  @Column({
    type: "enum",
    enum: ProductionOrderType,
    default: ProductionOrderType.PRODUCTION,
  })
  orderType: ProductionOrderType;

  // Product Kit Title (custom name provided by customer)
  @Column("text", { nullable: true })
  productKitTitle: string;

  // Item information
  @Column("text")
  itemCode: string;

  @Column("text")
  itemTitle: string;

  // Item configuration (JSON)
  @Column("simple-json")
  itemConfig: any;

  // Status
  @Column({
    type: "enum",
    enum: ProductionStatus,
    default: ProductionStatus.DRAFT,
  })
  status: ProductionStatus;

  // Stage (text field with default value)
  @Column({ default: "not-started" })
  stage: string;

  // Design ID
  @Column({ nullable: true })
  designId: number;

  // Audit fields
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => TenantUser)
  @JoinColumn({ name: "createdBy" })
  createdByUser: TenantUser;

  @Column()
  createdBy: number;

  @Column((type) => ProductionOrderCustomFields)
  customFields: ProductionOrderCustomFields;

  constructor(input?: DeepPartial<ProductionOrder>) {
    super(input);
  }
}
