import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Allow,
  Permission,
  ID,
  Transaction,
} from "@vendure/core";
import { ProductionOrderService } from "../services/production-order.service";
import {
  ProductionOrder,
  ProductionStatus,
} from "../entities/production-order.entity";

@Resolver()
export class ProductionOrderResolver {
  constructor(private productionOrderService: ProductionOrderService) {}

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<ProductionOrder | null> {
    return this.productionOrderService.findOneById(ctx, args.id);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrders(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any }
  ): Promise<any> {
    return this.productionOrderService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByTenant(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByTenant(ctx, args.tenantId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceId: number }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByWorkspace(ctx, args.workspaceId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByCustomer(
    @Ctx() ctx: RequestContext,
    @Args() args: { customerId: ID }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByCustomer(
      ctx,
      args.customerId as number
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { status: ProductionStatus }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByStatus(ctx, args.status);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByGroup(
    @Ctx() ctx: RequestContext,
    @Args() args: { groupId: number }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByGroup(ctx, args.groupId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderStatistics(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<any[]> {
    return this.productionOrderService.getStatistics(ctx, args.tenantId);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async createProductionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrder> {
    return this.productionOrderService.create(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async updateProductionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrder> {
    return this.productionOrderService.update(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async updateProductionOrderStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrder> {
    return this.productionOrderService.updateStatus(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async deleteProductionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<any> {
    const result = await this.productionOrderService.delete(ctx, args.id);
    return {
      result: result ? "DELETED" : "NOT_DELETED",
      message: result
        ? "Production order deleted successfully"
        : "Failed to delete production order",
    };
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async createMtoOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { groupTitle: string; orders: any[] }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.createMtoOrder(
      ctx,
      args.groupTitle,
      args.orders
    );
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async createAlterationOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { groupTitle: string; orders: any[] }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.createAlterationOrder(
      ctx,
      args.groupTitle,
      args.orders
    );
  }
}
