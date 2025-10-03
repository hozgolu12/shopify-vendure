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
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { TenantInventory } from "../entities/tenant-inventory.entity";
import { SilhouetteCategory } from "../entities/silhouette-category.entity";
import { Modifier } from "../entities/modifier.entity";
import { Attribute } from "../entities/attribute.entity";
import { Embellishment } from "../entities/embellishment.entity";
import { Motif } from "../entities/motif.entity";
import { TrimClosure } from "../entities/trim-closure.entity";
import { RegularAttribute } from "../entities/regular-attribute.entity";
import { ItemCode } from "../entities/item-code.entity";

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
  customFields?: any;
}

interface UpdateTenantInventoryInput {
  id: ID;
  workspaceId?: string;
  productRegions?: string[];
  customFields?: any;
}

@Injectable()
export class TenantInventoryService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<TenantInventory>,
    relations?: RelationPaths<TenantInventory>
  ): Promise<PaginatedList<TenantInventory>> {
    return this.listQueryBuilder
      .build(TenantInventory, options, {
        relations: relations || [
          "user",
          "silhouetteCategories",
          "modifiers",
          "attributes",
          "embellishments",
          "motifs",
          "trimsClosures",
          "regularAttributes",
          "itemCode",
        ],
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  async findOneById(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<TenantInventory>
  ): Promise<TenantInventory | null> {
    return this.connection.getRepository(ctx, TenantInventory).findOne({
      where: { id: id as any },
      relations: relations || [
        "user",
        "silhouetteCategories",
        "modifiers",
        "attributes",
        "embellishments",
        "motifs",
        "trimsClosures",
        "regularAttributes",
        "itemCode",
      ],
    });
  }

  async findByUserId(
    ctx: RequestContext,
    userId: ID,
    relations?: RelationPaths<TenantInventory>
  ): Promise<TenantInventory[]> {
    return this.connection.getRepository(ctx, TenantInventory).find({
      where: { userId: userId as any },
      relations: relations || [
        "silhouetteCategories",
        "modifiers",
        "attributes",
        "embellishments",
        "motifs",
        "trimsClosures",
        "regularAttributes",
        "itemCode",
      ],
    });
  }

  async findByWorkspaceId(
    ctx: RequestContext,
    workspaceId: string,
    relations?: RelationPaths<TenantInventory>
  ): Promise<TenantInventory[]> {
    return this.connection.getRepository(ctx, TenantInventory).find({
      where: { workspaceId },
      relations: relations || [
        "user",
        "silhouetteCategories",
        "modifiers",
        "attributes",
        "embellishments",
        "motifs",
        "trimsClosures",
        "regularAttributes",
        "itemCode",
      ],
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateTenantInventoryInput
  ): Promise<TenantInventory> {
    const inventoryRepo = this.connection.getRepository(ctx, TenantInventory);
    const silhouetteRepo = this.connection.getRepository(
      ctx,
      SilhouetteCategory
    );
    const modifierRepo = this.connection.getRepository(ctx, Modifier);
    const attributeRepo = this.connection.getRepository(ctx, Attribute);
    const embellishmentRepo = this.connection.getRepository(ctx, Embellishment);
    const motifRepo = this.connection.getRepository(ctx, Motif);
    const trimClosureRepo = this.connection.getRepository(ctx, TrimClosure);
    const regularAttributeRepo = this.connection.getRepository(
      ctx,
      RegularAttribute
    );
    const itemCodeRepo = this.connection.getRepository(ctx, ItemCode);

    // Create main inventory
    const inventory = inventoryRepo.create({
      userId: input.userId as number,
      workspaceId: input.workspaceId,
      productRegions: input.productRegions,
    });

    const savedInventory = await inventoryRepo.save(inventory);

    // Create related entities
    if (input.silhouetteCategories.length > 0) {
      const silhouettes = input.silhouetteCategories.map((sc) => {
        const { id, ...scData } = sc;
        return silhouetteRepo.create({
          ...scData,
          silhouetteId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.silhouetteCategories = await silhouetteRepo.save(
        silhouettes
      );
    }

    if (input.modifiers.length > 0) {
      const modifiers = input.modifiers.map((m) => {
        const { id, ...mData } = m;
        return modifierRepo.create({
          ...mData,
          modifierId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.modifiers = await modifierRepo.save(modifiers);
    }

    if (input.attributes.length > 0) {
      const attributes = input.attributes.map((a) => {
        const { id, ...aData } = a;
        return attributeRepo.create({
          ...aData,
          attributeId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.attributes = await attributeRepo.save(attributes);
    }

    if (input.embellishments.length > 0) {
      const embellishments = input.embellishments.map((e) => {
        const { id, ...eData } = e;
        return embellishmentRepo.create({
          ...eData,
          embellishmentId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.embellishments = await embellishmentRepo.save(
        embellishments
      );
    }

    if (input.motifs.length > 0) {
      const motifs = input.motifs.map((m) => {
        const { id, ...mData } = m;
        return motifRepo.create({
          ...mData,
          motifId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.motifs = await motifRepo.save(motifs);
    }

    if (input.trimsClosures.length > 0) {
      const trimsClosures = input.trimsClosures.map((tc) => {
        const { id, ...tcData } = tc;
        return trimClosureRepo.create({
          ...tcData,
          trimClosureId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.trimsClosures = await trimClosureRepo.save(trimsClosures);
    }

    if (input.regularAttributes.length > 0) {
      const regularAttributes = input.regularAttributes.map((ra) => {
        const { id, ...raData } = ra;
        return regularAttributeRepo.create({
          ...raData,
          regularAttributeId: id,
          inventory: savedInventory,
        });
      });
      savedInventory.regularAttributes = await regularAttributeRepo.save(
        regularAttributes
      );
    }

    if (input.itemCode) {
      const itemCode = itemCodeRepo.create({
        ...input.itemCode,
        inventory: savedInventory,
      });
      savedInventory.itemCode = await itemCodeRepo.save(itemCode);
    }

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        TenantInventory,
        input,
        savedInventory
      );
    }

    return this.findOneById(ctx, savedInventory.id) as Promise<TenantInventory>;
  }

  async update(
    ctx: RequestContext,
    input: UpdateTenantInventoryInput
  ): Promise<TenantInventory> {
    const inventoryRepo = this.connection.getRepository(ctx, TenantInventory);
    const { id, customFields, ...updateData } = input;

    await inventoryRepo.update(id, updateData);

    if (customFields) {
      const entity = await inventoryRepo.findOne({ where: { id: id as any } });
      if (entity) {
        await this.customFieldRelationService.updateRelations(
          ctx,
          TenantInventory,
          input,
          entity
        );
      }
    }

    return this.findOneById(ctx, id) as Promise<TenantInventory>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    try {
      const entity = await this.connection.getEntityOrThrow(
        ctx,
        TenantInventory,
        id
      );
      await this.connection.getRepository(ctx, TenantInventory).remove(entity);
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
}
