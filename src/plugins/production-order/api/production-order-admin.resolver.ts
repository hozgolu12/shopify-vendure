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
import { ProductionOrder } from "../entities/production-order.entity";
import { ProductionStatus } from "../types";

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
  async productionOrdersByTenantMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantMongoId: string }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByTenantMongoId(
      ctx,
      args.tenantMongoId
    );
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
  async productionOrdersByWorkspaceMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceMongoId: string }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByWorkspaceMongoId(
      ctx,
      args.workspaceMongoId
    );
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
  async productionOrdersByStage(
    @Ctx() ctx: RequestContext,
    @Args() args: { stage: string }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByStage(ctx, args.stage);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrdersByVendureOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { vendureOrderId: number }
  ): Promise<ProductionOrder[]> {
    return this.productionOrderService.findByVendureOrder(
      ctx,
      args.vendureOrderId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderStatisticsByStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<any[]> {
    return this.productionOrderService.getStatisticsByStatus(
      ctx,
      args.tenantId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderStatisticsByStage(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<any[]> {
    return this.productionOrderService.getStatisticsByStage(ctx, args.tenantId);
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
  async updateProductionOrderStage(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrder> {
    return this.productionOrderService.updateStage(ctx, args.input);
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
}
