import { Injectable } from "@nestjs/common";
import { TransactionalConnection, ID } from "@vendure/core";
import { TenantUser } from "../entities/user.entity";

@Injectable()
export class UserService {
  constructor(private connection: TransactionalConnection) {}

  async findOneByBetterAuthId(
    betterAuthId: string
  ): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { betterAuthId },
    });
  }

  async findOneById(id: ID): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { id: id as any },
    });
  }

  async findOneByEmail(email: string): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { email },
    });
  }

  async findAll(): Promise<TenantUser[]> {
    return this.connection.getRepository(TenantUser).find();
  }

  async createUser(input: {
    betterAuthId: string;
    name: string;
    email: string;
    companyName?: string;
    companyType?: string;
    role?: string;
  }): Promise<TenantUser> {
    const userRepo = this.connection.getRepository(TenantUser);

    const existingUser = await this.findOneByBetterAuthId(input.betterAuthId);
    if (existingUser) {
      throw new Error(
        `User with betterAuthId ${input.betterAuthId} already exists`
      );
    }

    const user = userRepo.create(input);
    return userRepo.save(user);
  }

  async updateUser(input: {
    id: ID;
    betterAuthId?: string;
    name?: string;
    email?: string;
    companyName?: string;
    companyType?: string;
    role?: string;
  }): Promise<TenantUser> {
    const userRepo = this.connection.getRepository(TenantUser);
    const { id, ...updateData } = input;
    await userRepo.update(id, updateData);
    const updatedUser = await this.findOneById(id);

    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async upsertUser(input: {
    betterAuthId: string;
    name: string;
    email: string;
    companyName?: string;
    companyType?: string;
    role?: string;
  }): Promise<TenantUser> {
    const userRepo = this.connection.getRepository(TenantUser);

    let user = await this.findOneByBetterAuthId(input.betterAuthId);

    if (user) {
      user.name = input.name;
      user.email = input.email;
      user.companyName = input.companyName as string;
      user.companyType = input.companyType as string;
      user.role = input.role as string;
    } else {
      user = userRepo.create(input);
    }

    return userRepo.save(user);
  }

  async deleteUser(id: ID): Promise<boolean> {
    const result = await this.connection.getRepository(TenantUser).delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
