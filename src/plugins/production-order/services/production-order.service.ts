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
} from "@vendure/core";
import { ProductionOrder } from "../entities/production-order.entity";
import { ProductionOrderType, ProductionStatus } from "../types";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductKit } from "../../product-kit/entities/product-kit.entity";

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
    return this.listQueryBuilder
      .build(ProductionOrder, options, {
        relations: relations || [
          "workspace",
          "customer",
          "createdByUser",
          "vendureOrder",
          "productKit",
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
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder | null> {
    return this.connection.getRepository(ctx, ProductionOrder).findOne({
      where: { id: id as any },
      relations: relations || [
        "workspace",
        "customer",
        "createdByUser",
        "vendureOrder",
        "productKit",
      ],
    });
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
    const workspaceRepo = this.connection.getRepository(ctx, Workspace);
    const customerRepo = this.connection.getRepository(ctx, Customer);
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const orderRepo = this.connection.getRepository(ctx, Order);
    const productKitRepo = this.connection.getRepository(ctx, ProductKit);

    // Verify workspace exists
    const workspace = await workspaceRepo.findOne({
      where: { id: input.workspaceId },
    });
    if (!workspace) {
      throw new Error(`Workspace with id ${input.workspaceId} not found`);
    }

    // Verify customer exists
    const customer = await customerRepo.findOne({
      where: { id: input.customerId as any },
    });
    if (!customer) {
      throw new Error(`Customer with id ${input.customerId} not found`);
    }

    // Verify createdBy user exists
    const createdByUser = await userRepo.findOne({
      where: { id: input.createdBy },
    });
    if (!createdByUser) {
      throw new Error(`User with id ${input.createdBy} not found`);
    }

    // Verify vendure order exists if provided
    if (input.vendureOrderId) {
      const vendureOrder = await orderRepo.findOne({
        where: { id: input.vendureOrderId as any },
      });
      if (!vendureOrder) {
        throw new Error(
          `Vendure order with id ${input.vendureOrderId} not found`
        );
      }
    }

    // Verify product kit exists if provided
    if (input.productKitId) {
      const productKit = await productKitRepo.findOne({
        where: { id: input.productKitId },
      });
      if (!productKit) {
        throw new Error(`Product kit with id ${input.productKitId} not found`);
      }
    }

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
    });

    const savedOrder = await productionOrderRepo.save(productionOrder);

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductionOrder,
        input,
        savedOrder
      );
    }

    return this.findOneById(ctx, savedOrder.id) as Promise<ProductionOrder>;
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
      throw new Error(`Production order with id ${id} not found`);
    }

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
      throw new Error(`Production order with id ${id} not found`);
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
      throw new Error(`Production order with id ${id} not found`);
    }

    productionOrder.stage = stage;
    await productionOrderRepo.save(productionOrder);
    return this.findOneById(ctx, id) as Promise<ProductionOrder>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, ProductionOrder)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
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
