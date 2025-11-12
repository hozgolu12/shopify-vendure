import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { DeepPartial, VendureEntity, HasCustomFields } from "@vendure/core";
import { ShopifyIntegrationPluginOptions } from "../types";

@Entity()
export class TenantShopifySettings extends VendureEntity implements HasCustomFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenantId: number;

  @Column()
  shopDomain: string;

  // API key / secret as provided by client
  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  apiSecret: string;

  // Long-lived access token (if app uses OAuth)
  @Column({ nullable: true })
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column((type) => Object)
  customFields: any;

  constructor(input?: DeepPartial<TenantShopifySettings>) {
    super(input as any);
    if (input) Object.assign(this, input);
  }
}
