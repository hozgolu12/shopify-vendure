import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  DeletionResponse,
  Permission,
} from "@vendure/common/lib/generated-types";
import { CustomFieldsObject } from "@vendure/common/lib/shared-types";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
  Transaction,
  TranslationInput,
} from "@vendure/core";
import { TenantInventory } from "../entities/tenant-inventory.entity";
import { TenantInventoryService } from "../services/tenant-inventory.service";

// These can be replaced by generated types if you set up code generation
interface CreateTenantInventoryInput {
  userId: ID;
  workspaceId?: string;
  productRegions: string[];
  silhouetteCategories: Array<{
    id: string;
    name: string;
    enabled: boolean;
    silhouetteTypes: string[];
  }>;
  modifiers: Array<{
    id: string;
    groupName: string;
    enabled: boolean;
    modifiers: string[];
  }>;
  attributes: Array<{
    id: string;
    groupName: string;
    enabled: boolean;
    values: string[];
  }>;
  embellishments: Array<{
    id: string;
    groupName: string;
    enabled: boolean;
    values: string[];
    code?: string;
  }>;
  motifs: Array<{
    id: string;
    groupName: string;
    enabled: boolean;
    values: string[];
    code?: string;
  }>;
  trimsClosures: Array<{
    id: string;
    groupName: string;
    enabled: boolean;
    values: string[];
  }>;
  regularAttributes: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    properties: string[];
    group?: string;
    parent?: string;
    abbreviation?: string;
  }>;
  itemCode: {
    itemCodeAttributes: string[];
    itemNameAttributes: string[];
    delimiter: string;
    itemCode: string;
    itemName: string;
  };
  customFields?: CustomFieldsObject;
}
interface UpdateTenantInventoryInput {
  id: ID;
  workspaceId?: string;
  productRegions?: string[];
  customFields?: CustomFieldsObject;
}

@Resolver()
export class TenantInventoryAdminResolver {
  constructor(private tenantInventoryService: TenantInventoryService) {}

  @Query()
  @Allow(Permission.SuperAdmin)
  async tenantInventory(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(TenantInventory) relations: RelationPaths<TenantInventory>
  ): Promise<TenantInventory | null> {
    return this.tenantInventoryService.findOneById(ctx, args.id, relations);
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async tenantInventorys(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<TenantInventory> },
    @Relations(TenantInventory) relations: RelationPaths<TenantInventory>
  ): Promise<PaginatedList<TenantInventory>> {
    return this.tenantInventoryService.findAll(
      ctx,
      args.options || undefined,
      relations
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async createTenantInventory(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateTenantInventoryInput }
  ): Promise<TenantInventory> {
    return this.tenantInventoryService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async updateTenantInventory(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateTenantInventoryInput }
  ): Promise<TenantInventory> {
    return this.tenantInventoryService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async deleteTenantInventory(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<DeletionResponse> {
    return this.tenantInventoryService.delete(ctx, args.id);
  }
}
