import { Injectable } from "@nestjs/common";
import {
  TransactionalConnection,
  ID,
  RequestContext,
  CustomFieldRelationService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  PaginatedList,
} from "@vendure/core";
import { CustomFieldsObject } from "@vendure/common/lib/shared-types";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { TenantUser } from "../entities/user.entity";

// Input interfaces for create and update operations
interface CreateTenantUserInput {
  betterAuthId: string;
  name: string;
  email: string;
  companyName?: string;
  companyType?: string;
  role?: string;
  customFields?: CustomFieldsObject;
}

interface UpdateTenantUserInput {
  id: ID;
  betterAuthId?: string;
  name?: string;
  email?: string;
  companyName?: string;
  companyType?: string;
  role?: string;
  customFields?: CustomFieldsObject;
}

@Injectable()
export class UserService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  // Enhanced findAll method with pagination and custom fields support
  findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<TenantUser>,
    relations?: RelationPaths<TenantUser>
  ): Promise<PaginatedList<TenantUser>> {
    return this.listQueryBuilder
      .build(TenantUser, options, {
        relations,
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }

  async findOneByBetterAuthId(
    betterAuthId: string
  ): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { betterAuthId },
    });
  }

  async findOneById(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<TenantUser>
  ): Promise<TenantUser | null> {
    return this.connection.getRepository(ctx, TenantUser).findOne({
      where: { id: id as any },
      relations,
    });
  }

  // Legacy method for backward compatibility
  async findOneByIdLegacy(id: ID): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { id: id as any },
    });
  }

  async findOneByEmail(email: string): Promise<TenantUser | null> {
    return this.connection.getRepository(TenantUser).findOne({
      where: { email },
    });
  }

  // Legacy method for backward compatibility
  async findAllLegacy(): Promise<TenantUser[]> {
    return this.connection.getRepository(TenantUser).find();
  }

  async create(
    ctx: RequestContext,
    input: CreateTenantUserInput
  ): Promise<TenantUser> {
    const userRepo = this.connection.getRepository(ctx, TenantUser);

    const existingUser = await this.findOneByBetterAuthId(input.betterAuthId);
    if (existingUser) {
      throw new Error(
        `User with betterAuthId ${input.betterAuthId} already exists`
      );
    }

    const user = userRepo.create(input);
    const savedUser = await userRepo.save(user);

    // Handle custom field relations
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        TenantUser,
        input,
        savedUser
      );
    }

    return savedUser;
  }

  // Legacy method for backward compatibility
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

  async update(
    ctx: RequestContext,
    input: UpdateTenantUserInput
  ): Promise<TenantUser> {
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const { id, customFields, ...updateData } = input;

    // Update the main entity fields
    await userRepo.update(id, updateData);

    // Handle custom field relations
    if (customFields) {
      const entity = await userRepo.findOne({ where: { id: id as any } });
      if (entity) {
        await this.customFieldRelationService.updateRelations(
          ctx,
          TenantUser,
          input,
          entity
        );
      }
    }

    const updatedUser = await this.findOneById(ctx, id);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  // Legacy method for backward compatibility
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
    const updatedUser = await this.findOneByIdLegacy(id);

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

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(ctx, TenantUser, id);
    try {
      await this.connection.getRepository(ctx, TenantUser).remove(entity);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }

  // Legacy method for backward compatibility
  async deleteUser(id: ID): Promise<boolean> {
    const result = await this.connection.getRepository(TenantUser).delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
