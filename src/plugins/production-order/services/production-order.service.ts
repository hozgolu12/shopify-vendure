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
} from "@vendure/core";
import {
  ProductionOrder,
  ProductionOrderType,
  ProductionStatus,
} from "../entities/production-order.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";

interface CreateProductionOrderInput {
  tenantId: number;
  workspaceId: number;
  customerId: number;
  orderType: ProductionOrderType;
  groupId?: number;
  groupTitle?: string;
  itemCode: string;
  itemTitle: string;
  status?: ProductionStatus;
  itemConfig: any;
  createdBy: number;
  customFields?: any;
}

interface UpdateProductionOrderInput {
  id: ID;
  workspaceId?: number;
  customerId?: number;
  orderType?: ProductionOrderType;
  groupId?: number;
  groupTitle?: string;
  itemCode?: string;
  itemTitle?: string;
  status?: ProductionStatus;
  itemConfig?: any;
  updatedBy: number;
  customFields?: any;
}

interface UpdateProductionOrderStatusInput {
  id: ID;
  status: ProductionStatus;
  updatedBy: number;
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
          "updatedByUser",
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
        "updatedByUser",
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
      relations: relations || ["workspace", "customer", "createdByUser"],
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
      relations: relations || ["customer", "createdByUser"],
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
      relations: relations || ["workspace", "createdByUser"],
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
      relations: relations || ["workspace", "customer", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findByGroup(
    ctx: RequestContext,
    groupId: number,
    relations?: RelationPaths<ProductionOrder>
  ): Promise<ProductionOrder[]> {
    return this.connection.getRepository(ctx, ProductionOrder).find({
      where: { groupId },
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

    const productionOrder = productionOrderRepo.create({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      customerId: input.customerId,
      orderType: input.orderType,
      groupId: input.groupId,
      groupTitle: input.groupTitle,
      itemCode: input.itemCode,
      itemTitle: input.itemTitle,
      status: input.status || ProductionStatus.DRAFT,
      itemConfig: input.itemConfig,
      createdBy: input.createdBy,
      updatedBy: input.createdBy, // Same as createdBy initially
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
    const { id, customFields, updatedBy, ...updateData } = input;

    const productionOrder = await this.findOneById(ctx, id);
    if (!productionOrder) {
      throw new Error(`Production order with id ${id} not found`);
    }

    // Verify updatedBy user exists
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const updatedByUser = await userRepo.findOne({ where: { id: updatedBy } });
    if (!updatedByUser) {
      throw new Error(`User with id ${updatedBy} not found`);
    }

    Object.assign(productionOrder, updateData);
    productionOrder.updatedBy = updatedBy;

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
    const { id, status, updatedBy } = input;

    const productionOrder = await this.findOneById(ctx, id);
    if (!productionOrder) {
      throw new Error(`Production order with id ${id} not found`);
    }

    // Verify updatedBy user exists
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const updatedByUser = await userRepo.findOne({ where: { id: updatedBy } });
    if (!updatedByUser) {
      throw new Error(`User with id ${updatedBy} not found`);
    }

    productionOrder.status = status;
    productionOrder.updatedBy = updatedBy;

    await productionOrderRepo.save(productionOrder);
    return this.findOneById(ctx, id) as Promise<ProductionOrder>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, ProductionOrder)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async createMtoOrder(
    ctx: RequestContext,
    groupTitle: string,
    orders: Omit<CreateProductionOrderInput, "groupId" | "groupTitle">[]
  ): Promise<ProductionOrder[]> {
    // Generate a unique group ID
    const groupId = Date.now();

    const createdOrders: ProductionOrder[] = [];

    for (const orderInput of orders) {
      const order = await this.create(ctx, {
        ...orderInput,
        orderType: ProductionOrderType.MTO,
        groupId,
        groupTitle,
      });
      createdOrders.push(order);
    }

    return createdOrders;
  }

  async createAlterationOrder(
    ctx: RequestContext,
    groupTitle: string,
    orders: Omit<CreateProductionOrderInput, "groupId" | "groupTitle">[]
  ): Promise<ProductionOrder[]> {
    // Generate a unique group ID
    const groupId = Date.now();

    const createdOrders: ProductionOrder[] = [];

    for (const orderInput of orders) {
      const order = await this.create(ctx, {
        ...orderInput,
        orderType: ProductionOrderType.ALTERATION,
        groupId,
        groupTitle,
      });
      createdOrders.push(order);
    }

    return createdOrders;
  }

  // Get orders statistics
  async getStatistics(
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
}
