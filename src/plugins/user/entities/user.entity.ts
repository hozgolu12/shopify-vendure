import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { DeepPartial } from "@vendure/core";

@Entity()
export class TenantUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  betterAuthId: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyType: string;

  @Column({ nullable: true })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(input?: DeepPartial<TenantUser>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
}
