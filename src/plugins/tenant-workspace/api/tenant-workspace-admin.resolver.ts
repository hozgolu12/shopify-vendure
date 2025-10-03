import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Allow,
  Permission,
  ID,
  Transaction,
} from "@vendure/core";
import { WorkspaceService } from "../services/tenant-workspace.service";
import { Workspace } from "../entities/tenant-workspace.entity";

@Resolver()
export class WorkspaceResolver {
  constructor(private workspaceService: WorkspaceService) {}

  @Query()
  @Allow(Permission.Authenticated)
  async tenantWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<Workspace | null> {
    return this.workspaceService.findOneById(ctx, args.id);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async tenantWorkspaces(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any }
  ): Promise<any> {
    return this.workspaceService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async tenantWorkspacesByUserId(
    @Ctx() ctx: RequestContext,
    @Args() args: { userId: ID }
  ): Promise<Workspace[]> {
    return this.workspaceService.findByUserId(ctx, args.userId);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async tenantWorkspacesByOrganizationId(
    @Ctx() ctx: RequestContext,
    @Args() args: { organizationId: string }
  ): Promise<Workspace[]> {
    return this.workspaceService.findByOrganizationId(ctx, args.organizationId);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  @Transaction()
  async createTenantWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<Workspace> {
    return this.workspaceService.create(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  @Transaction()
  async updateTenantWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<Workspace> {
    return this.workspaceService.update(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  @Transaction()
  async deleteTenantWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<any> {
    const result = await this.workspaceService.delete(ctx, args.id);
    return {
      result: result ? "DELETED" : "NOT_DELETED",
      message: result
        ? "Workspace deleted successfully"
        : "Failed to delete workspace",
    };
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  @Transaction()
  async addMeasurementFieldToWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceId: ID; measurementField: any }
  ): Promise<Workspace> {
    return this.workspaceService.addMeasurementField(
      ctx,
      args.workspaceId,
      args.measurementField
    );
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  @Transaction()
  async removeMeasurementFieldFromWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { measurementFieldId: ID }
  ): Promise<boolean> {
    return this.workspaceService.removeMeasurementField(
      ctx,
      args.measurementFieldId
    );
  }
}
