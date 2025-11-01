import { Args, Mutation, Query, Resolver, registerEnumType } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Allow,
  Permission,
  ID,
  Transaction,
} from "@vendure/core";
import { ProductionOrderTaskService } from "../services/production-order-task.service";
import { ProductionOrderTask } from "../entities/production-order-task.entity";
import { TaskStatus } from "../types";

// Register the TaskStatus enum with GraphQL
registerEnumType(TaskStatus, {
  name: "TaskStatus",
  description: "Status of a production order task",
});

@Resolver()
export class ProductionOrderTaskResolver {
  constructor(private productionOrderTaskService: ProductionOrderTaskService) {}

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTask(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<ProductionOrderTask | null> {
    return this.productionOrderTaskService.findOneById(ctx, args.id);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasks(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any }
  ): Promise<any> {
    return this.productionOrderTaskService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByProductionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { productionOrderId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByProductionOrder(
      ctx,
      args.productionOrderId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByTenant(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByTenant(ctx, args.tenantId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByTenantMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantMongoId: string }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByTenantMongoId(
      ctx,
      args.tenantMongoId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByWorkspace(
      ctx,
      args.workspaceId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByWorkspaceMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceMongoId: string }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByWorkspaceMongoId(
      ctx,
      args.workspaceMongoId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { status: TaskStatus }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByStatus(ctx, args.status);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByAssignee(
    @Ctx() ctx: RequestContext,
    @Args() args: { userId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByAssignee(ctx, args.userId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByAssigneesMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { assigneeMongoId: string }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByAssigneesMongoId(
      ctx,
      args.assigneeMongoId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksBySupervisor(
    @Ctx() ctx: RequestContext,
    @Args() args: { supervisorId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findBySupervisor(
      ctx,
      args.supervisorId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksBySupervisorMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { supervisorMongoId: string }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findBySupervisorMongoId(
      ctx,
      args.supervisorMongoId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTasksByCreatedByMongoId(
    @Ctx() ctx: RequestContext,
    @Args() args: { createdByMongoId: string }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findByCreatedByMongoId(
      ctx,
      args.createdByMongoId
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderSubTasks(
    @Ctx() ctx: RequestContext,
    @Args() args: { parentId: number }
  ): Promise<ProductionOrderTask[]> {
    return this.productionOrderTaskService.findSubTasks(ctx, args.parentId);
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async productionOrderTaskStatistics(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<any[]> {
    return this.productionOrderTaskService.getStatisticsByStatus(
      ctx,
      args.tenantId
    );
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async createProductionOrderTask(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrderTask> {
    return this.productionOrderTaskService.create(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async updateProductionOrderTask(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrderTask> {
    return this.productionOrderTaskService.update(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async updateProductionOrderTaskStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrderTask> {
    return this.productionOrderTaskService.updateStatus(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async assignProductionOrderTask(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductionOrderTask> {
    return this.productionOrderTaskService.assignTask(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async addProductionOrderTaskDependency(
    @Ctx() ctx: RequestContext,
    @Args() args: { taskId: ID; dependencyTaskId: number }
  ): Promise<ProductionOrderTask> {
    return this.productionOrderTaskService.addDependency(
      ctx,
      args.taskId,
      args.dependencyTaskId
    );
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async deleteProductionOrderTask(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<any> {
    const result = await this.productionOrderTaskService.delete(ctx, args.id);
    return {
      result: result ? "DELETED" : "NOT_DELETED",
      message: result
        ? "Production order task deleted successfully"
        : "Failed to delete production order task",
    };
  }
}
