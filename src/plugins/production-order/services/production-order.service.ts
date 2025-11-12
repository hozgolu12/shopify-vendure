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
  Customer,
  Order,
  UserInputError,
} from "@vendure/core";
import { QueryFailedError } from "typeorm";
import { ProductionOrder } from "../entities/production-order.entity";
import { ProductionOrderType, ProductionStatus } from "../types";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
// import { ProductKit } from "../../product-kit/entities/product-kit.entity";

interface CreateProductionOrderInput {
  tenantId: number;
  tenantMongoId: string;
  workspaceId: number;
  workspaceMongoId: string;
  vendureOrderId?: number;
  vendureItemId?: number;
  productKitId?: number;
  customerId: number;
  orderType: ProductionOrderType;
  productKitTitle?: string;
  itemCode: string;
  itemTitle: string;
  itemConfig: any;
  status?: ProductionStatus;
  stage?: string;
  designId?: number;
  createdBy: number;
  createdByMongoId?: string;
  customFields?: any;
}

interface UpdateProductionOrderInput {
  id: ID;
  workspaceId?: number;
  vendureOrderId?: number;
  vendureItemId?: number;
  productKitId?: number;
  customerId?: number;
  orderType?: ProductionOrderType;
  productKitTitle?: string;
  itemCode?: string;
  itemTitle?: string;
  itemConfig?: any;
  status?: ProductionStatus;
  stage?: string;
  designId?: number;
  customFields?: any;
}

interface UpdateProductionOrderStatusInput {
  id: ID;
  status: ProductionStatus;
}

interface UpdateProductionOrderStageInput {
  id: ID;
  stage: string;
}

@Injectable()
export class ProductionOrderService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ProductionOrder>,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<PaginatedList<ProductionOrder>> {
    const queryBuilder = this.listQueryBuilder.build(ProductionOrder, options, {
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
        // "productKit",
      ],
      ctx,
    });

    // Explicitly add MongoDB ID fields to ensure they're selected
    const alias = queryBuilder.alias || "production_order";
    queryBuilder.addSelect([
      `${alias}.tenantMongoId`,
      `${alias}.workspaceMongoId`,
      `${alias}.createdByMongoId`,
    ]);

    return queryBuilder.getManyAndCount().then(([items, totalItems]) => ({
      items,
      totalItems,
    }));
  }

  async findOneById(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder | null> {
    return (
      this.connection
        .getRepository(ctx, ProductionOrder)
        .createQueryBuilder("order")
        .where("order.id = :id", { id })
        .leftJoinAndSelect("order.workspace", "workspace")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.createdByUser", "createdByUser")
        .leftJoinAndSelect("order.vendureOrder", "vendureOrder")
        // .leftJoinAndSelect("order.productKit", "productKit")
        .addSelect([
          "order.tenantMongoId",
          "order.workspaceMongoId",
          "order.createdByMongoId",
        ])
        .getOne()
    );
  }

  async findByTenant(
    ctx: RequestContext,
    tenantId: number,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { tenantId },
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByTenantMongoId(
    ctx: RequestContext,
    tenantMongoId: string,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { tenantMongoId },
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByWorkspace(
    ctx: RequestContext,
    workspaceId: number,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { workspaceId },
      relations: relations || ["customer", "createdByUser", "vendureOrder"],
      order: { createdAt: "DESC" },
    });
  }

  async findByWorkspaceMongoId(
    ctx: RequestContext,
    workspaceMongoId: string,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { workspaceMongoId },
      relations: relations || ["customer", "createdByUser", "vendureOrder"],
      order: { createdAt: "DESC" },
    });
  }

  async findByCustomer(
    ctx: RequestContext,
    customerId: number,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { customerId },
      relations: relations || ["workspace", "createdByUser", "vendureOrder"],
      order: { createdAt: "DESC" },
    });
  }

  async findByStatus(
    ctx: RequestContext,
    status: ProductionStatus,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { status },
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByStage(
    ctx: RequestContext,
    stage: string,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { stage },
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByVendureOrder(
    ctx: RequestContext,
    vendureOrderId: number,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { vendureOrderId },
      relations: relations || ["workspace", "customer", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateProductionOrderInput
  ): Promise<ProductionOrder> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );
    await this.ensureRelatedEntitiesExist(ctx, {
      workspaceId: input.workspaceId,
      customerId: input.customerId,
      createdBy: input.createdBy,
      vendureOrderId: input.vendureOrderId,
    });

    const productionOrder = productionOrderRepo.create({
      tenantId: input.tenantId,
      tenantMongoId: input.tenantMongoId,
      workspaceId: input.workspaceId,
      workspaceMongoId: input.workspaceMongoId,
      vendureOrderId: input.vendureOrderId,
      vendureItemId: input.vendureItemId,
      productKitId: input.productKitId,
      customerId: input.customerId,
      orderType: input.orderType,
      productKitTitle: input.productKitTitle,
      itemCode: input.itemCode,
      itemTitle: input.itemTitle,
      itemConfig: input.itemConfig,
      status: input.status || ProductionStatus.DRAFT,
      stage: input.stage || "not-started",
      designId: input.designId,
      createdBy: input.createdBy,
      createdByMongoId: input.createdByMongoId,
    });

    const savedOrder = await productionOrderRepo.save(productionOrder);

    // Preserve MongoDB IDs from saved entity before reloading
    const preservedMongoIds = {
      tenantMongoId: savedOrder.tenantMongoId,
      workspaceMongoId: savedOrder.workspaceMongoId,
      createdByMongoId: savedOrder.createdByMongoId,
    };

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductionOrder,
        input,
        savedOrder
      );
    }

    const reloadedOrder = await this.findOneById(ctx, savedOrder.id);

    // Restore MongoDB IDs if they were lost during reload
    if (reloadedOrder) {
      reloadedOrder.tenantMongoId = preservedMongoIds.tenantMongoId;
      reloadedOrder.workspaceMongoId = preservedMongoIds.workspaceMongoId;
      reloadedOrder.createdByMongoId = preservedMongoIds.createdByMongoId;
    }

    return reloadedOrder as ProductionOrder;
  }

  private async ensureRelatedEntitiesExist(
    ctx: RequestContext,
    relations: {
      workspaceId?: number;
      customerId?: number;
      createdBy?: number;
      vendureOrderId?: number;
    }
  ): Promise<void> {
    const workspaceId =
      typeof relations.workspaceId === "number"
        ? relations.workspaceId
        : undefined;
    const customerId =
      typeof relations.customerId === "number"
        ? relations.customerId
        : undefined;
    const createdById =
      typeof relations.createdBy === "number" ? relations.createdBy : undefined;
    const vendureOrderId =
      typeof relations.vendureOrderId === "number"
        ? relations.vendureOrderId
        : undefined;

    const [workspace, customer, createdByUser, vendureOrder] =
      await Promise.all([
        workspaceId !== undefined
          ? this.connection
              .getRepository(ctx, Workspace)
              .findOne({ where: { id: workspaceId } })
          : Promise.resolve(null),
        customerId !== undefined
          ? this.connection
              .getRepository(ctx, Customer)
              .findOne({ where: { id: customerId } })
          : Promise.resolve(null),
        createdById !== undefined
          ? this.connection
              .getRepository(ctx, TenantUser)
              .findOne({ where: { id: createdById } })
          : Promise.resolve(null),
        vendureOrderId !== undefined
          ? this.connection
              .getRepository(ctx, Order)
              .findOne({ where: { id: vendureOrderId } })
          : Promise.resolve(null),
      ]);

    if (workspaceId !== undefined && !workspace) {
      throw new UserInputError(`Workspace with id ${workspaceId} not found`);
    }
    if (customerId !== undefined && !customer) {
      throw new UserInputError(`Customer with id ${customerId} not found`);
    }
    if (createdById !== undefined && !createdByUser) {
      throw new UserInputError(`User with id ${createdById} not found`);
    }
    if (vendureOrderId !== undefined && !vendureOrder) {
      throw new UserInputError(
        `Vendure order with id ${vendureOrderId} not found`
      );
    }
  }

  async update(
    ctx: RequestContext,
    input: UpdateProductionOrderInput
  ): Promise<ProductionOrder> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );
    const { id, customFields, ...updateData } = input;

    const productionOrder = await this.findOneById(ctx, id);
    if (!productionOrder) {
      throw new UserInputError(`Production order with id ${id} not found`);
    }

    await this.ensureRelatedEntitiesExist(ctx, {
      workspaceId: updateData.workspaceId,
      customerId: updateData.customerId,
      vendureOrderId: updateData.vendureOrderId,
    });

    Object.assign(productionOrder, updateData);
    await productionOrderRepo.save(productionOrder);

    // Handle custom fields
    if (customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductionOrder,
        input,
        productionOrder
      );
    }

    return this.findOneById(ctx, id) as Promise<ProductionOrder>;
  }

  async updateStatus(
    ctx: RequestContext,
    input: UpdateProductionOrderStatusInput
  ): Promise<ProductionOrder> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );
    const { id, status } = input;

    const productionOrder = await this.findOneById(ctx, id);
    if (!productionOrder) {
      throw new UserInputError(`Production order with id ${id} not found`);
    }

    productionOrder.status = status;
    await productionOrderRepo.save(productionOrder);
    return this.findOneById(ctx, id) as Promise<ProductionOrder>;
  }

  async updateStage(
    ctx: RequestContext,
    input: UpdateProductionOrderStageInput
  ): Promise<ProductionOrder> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );
    const { id, stage } = input;

    const productionOrder = await this.findOneById(ctx, id);
    if (!productionOrder) {
      throw new UserInputError(`Production order with id ${id} not found`);
    }

    productionOrder.stage = stage;
    await productionOrderRepo.save(productionOrder);
    return this.findOneById(ctx, id) as Promise<ProductionOrder>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const existing = await this.findOneById(ctx, id);
    if (!existing) {
      throw new UserInputError(`Production order with id ${id} not found`);
    }

    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );

    try {
      const result = await productionOrderRepo.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (
          error as QueryFailedError & {
            driverError?: { code?: string };
          }
        ).driverError?.code === "23503"
      ) {
        throw new UserInputError(
          `Cannot delete production order with id ${id} because it is referenced by other records`
        );
      }
      throw error;
    }
  }

  async getLastKitId(ctx: RequestContext): Promise<number | null> {
    const result = await this.connection
      .getRepository(ctx, ProductionOrder)
      .createQueryBuilder("order")
      .select("MAX(order.productKitId)", "max")
      .where("order.productKitId IS NOT NULL")
      .getRawOne<{ max: string | null }>();

    if (!result || result.max === null) {
      return 0;
    }

    const parsedMax = Number(result.max);
    if (!Number.isFinite(parsedMax)) {
      return null;
    }

    return parsedMax;
  }

  // Get orders statistics by status
  async getStatisticsByStatus(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ status: ProductionStatus; count: number }[]> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );

    return productionOrderRepo
      .createQueryBuilder("order")
      .select("order.status", "status")
      .addSelect("COUNT(order.id)", "count")
      .where("order.tenantId = :tenantId", { tenantId })
      .groupBy("order.status")
      .getRawMany();
  }

  // Get orders statistics by stage
  async getStatisticsByStage(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ stage: string; count: number }[]> {
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );

    return productionOrderRepo
      .createQueryBuilder("order")
      .select("order.stage", "stage")
      .addSelect("COUNT(order.id)", "count")
      .where("order.tenantId = :tenantId", { tenantId })
      .groupBy("order.stage")
      .getRawMany();
  }
}
