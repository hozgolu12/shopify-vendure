import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Allow,
  Permission,
  ID,
  Transaction,
} from "@vendure/core";
import { ArtisanTaskTimesheetService } from "../services/artisans-task-timesheet.service";
import { ArtisanTaskTimesheet } from "../entities/artisans-task-timesheet.entity";
import { ArtisanTaskTimesheetWithCalculatedFields } from "../types";

@Resolver()
export class ArtisanTaskTimesheetResolver {
  constructor(
    private artisanTaskTimesheetService: ArtisanTaskTimesheetService
  ) {}

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheet(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields | null> {
    const timesheet = await this.artisanTaskTimesheetService.findOneById(
      ctx,
      args.id
    );
    if (!timesheet) {
      return null;
    }
    return {
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    };
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheets(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any }
  ): Promise<{
    items: ArtisanTaskTimesheetWithCalculatedFields[];
    totalItems: number;
  }> {
    const result = await this.artisanTaskTimesheetService.findAll(
      ctx,
      args.options
    );
    // Add calculated fields to each item
    const items: ArtisanTaskTimesheetWithCalculatedFields[] = result.items.map(
      (timesheet: ArtisanTaskTimesheet) => ({
        ...timesheet,
        totalCost: timesheet.calculateTotalCost(),
        timeSpentInHours: timesheet.getTimeSpentInHours(),
      })
    );
    return { items, totalItems: result.totalItems };
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetsByTenant(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets = await this.artisanTaskTimesheetService.findByTenant(
      ctx,
      args.tenantId
    );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetsByWorkspace(
    @Ctx() ctx: RequestContext,
    @Args() args: { workspaceId: number }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets = await this.artisanTaskTimesheetService.findByWorkspace(
      ctx,
      args.workspaceId
    );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetsByArtisan(
    @Ctx() ctx: RequestContext,
    @Args() args: { artisanId: number }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets = await this.artisanTaskTimesheetService.findByArtisan(
      ctx,
      args.artisanId
    );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetsByProductionOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { productionOrderId: number }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets =
      await this.artisanTaskTimesheetService.findByProductionOrder(
        ctx,
        args.productionOrderId
      );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetsByDateRange(
    @Ctx() ctx: RequestContext,
    @Args() args: { startDate: Date; endDate: Date }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets = await this.artisanTaskTimesheetService.findByDateRange(
      ctx,
      args.startDate,
      args.endDate
    );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async activeArtisanTaskTimesheets(
    @Ctx() ctx: RequestContext,
    @Args() args: { artisanId?: number }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields[]> {
    const timesheets =
      await this.artisanTaskTimesheetService.findActiveTimesheets(
        ctx,
        args.artisanId
      );
    return timesheets.map((timesheet) => ({
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    }));
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanTaskTimesheetStatistics(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number; startDate?: Date; endDate?: Date }
  ): Promise<any> {
    return this.artisanTaskTimesheetService.getStatistics(
      ctx,
      args.tenantId,
      args.startDate,
      args.endDate
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder, Permission.ReadOrder)
  async artisanProductivityReport(
    @Ctx() ctx: RequestContext,
    @Args() args: { artisanId: number; startDate: Date; endDate: Date }
  ): Promise<any> {
    return this.artisanTaskTimesheetService.getArtisanProductivityReport(
      ctx,
      args.artisanId,
      args.startDate,
      args.endDate
    );
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async createArtisanTaskTimesheet(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields> {
    const timesheet = await this.artisanTaskTimesheetService.create(
      ctx,
      args.input
    );
    return {
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    };
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async updateArtisanTaskTimesheet(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields> {
    const timesheet = await this.artisanTaskTimesheetService.update(
      ctx,
      args.input
    );
    return {
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    };
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async stopArtisanTaskTimesheet(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ArtisanTaskTimesheetWithCalculatedFields> {
    const timesheet = await this.artisanTaskTimesheetService.stopTimesheet(
      ctx,
      args.input
    );
    return {
      ...timesheet,
      totalCost: timesheet.calculateTotalCost(),
      timeSpentInHours: timesheet.getTimeSpentInHours(),
    };
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateOrder)
  @Transaction()
  async deleteArtisanTaskTimesheet(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<any> {
    const result = await this.artisanTaskTimesheetService.delete(ctx, args.id);
    return {
      result: result ? "DELETED" : "NOT_DELETED",
      message: result
        ? "Artisan task timesheet deleted successfully"
        : "Failed to delete artisan task timesheet",
    };
  }
}
