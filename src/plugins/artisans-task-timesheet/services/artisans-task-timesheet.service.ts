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
import { ArtisanTaskTimesheet } from "../entities/artisans-task-timesheet.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductionOrder } from "../../production-order/entities/production-order.entity";

interface CreateArtisanTaskTimesheetInput {
  tenantId: number;
  tenantMongoId?: string;
  workspaceId: number;
  workspaceMongoId?: string;
  artisanId: number;
  artisanMongoId?: string;
  startDate: Date;
  endDate?: Date;
  rate: number;
  rateType: "hourly" | "daily";
  productionOrderId?: number;
  rework?: boolean;
  productive?: boolean;
  reason?: string;
  createdBy: number;
  createdByMongoId?: string;
  customFields?: any;
}

interface UpdateArtisanTaskTimesheetInput {
  id: ID;
  workspaceId?: number;
  workspaceMongoId?: string;
  artisanId?: number;
  artisanMongoId?: string;
  startDate?: Date;
  endDate?: Date;
  rate?: number;
  rateType?: "hourly" | "daily";
  productionOrderId?: number;
  rework?: boolean;
  productive?: boolean;
  reason?: string;
  customFields?: any;
}

interface StopTimesheetInput {
  id: ID;
  endDate: Date;
}

@Injectable()
export class ArtisanTaskTimesheetService {
  private hasMongoIdColumnsCache: boolean | null = null;

  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ArtisanTaskTimesheet>,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<PaginatedList<ArtisanTaskTimesheet>> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      // All columns exist, use normal query
      return this.listQueryBuilder
        .build(ArtisanTaskTimesheet, options, {
          relations: relations || [
            "workspace",
            "artisan",
            "productionOrder",
            "createdByUser",
          ],
          ctx,
        })
        .getManyAndCount()
        .then(([items, totalItems]) => ({
          items,
          totalItems,
        }));
    } else {
      // Use query builder with explicit column selection (excluding mongoId columns)
      const queryBuilder = await this.createSafeQueryBuilder(ctx, "timesheet");

      // Apply pagination if provided
      if (options?.skip) {
        queryBuilder.skip(options.skip);
      }
      if (options?.take) {
        queryBuilder.take(options.take);
      }

      // Note: We skip productionOrder relation to avoid column issues there too
      const [items, totalItems] = await queryBuilder.getManyAndCount();
      return { items, totalItems };
    }
  }

  async findOneById(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet | null> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      // All columns exist, but we need to explicitly select MongoDB ID fields
      // because they have select: false in the entity definition
      return this.connection
        .getRepository(ctx, ArtisanTaskTimesheet)
        .createQueryBuilder("timesheet")
        .where("timesheet.id = :id", { id })
        .leftJoinAndSelect("timesheet.workspace", "workspace")
        .leftJoinAndSelect("timesheet.artisan", "artisan")
        .leftJoinAndSelect("timesheet.productionOrder", "productionOrder")
        .leftJoinAndSelect("timesheet.createdByUser", "createdByUser")
        .addSelect([
          "timesheet.tenantMongoId",
          "timesheet.workspaceMongoId",
          "timesheet.artisanMongoId",
          "timesheet.createdByMongoId",
        ])
        .getOne();
    } else {
      // Use query builder with explicit column selection (excluding mongoId columns)
      const queryBuilder = await this.createSafeQueryBuilder(ctx, "timesheet");
      queryBuilder.where("timesheet.id = :id", { id });

      // Skip productionOrder relation to avoid column issues
      return queryBuilder.getOne();
    }
  }

  async findByTenant(
    ctx: RequestContext,
    tenantId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { tenantId },
        relations: relations || ["workspace", "artisan", "productionOrder"],
        order: { startDate: "DESC" },
      });
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder
        .where("timesheet.tenantId = :tenantId", { tenantId })
        .orderBy("timesheet.startDate", "DESC");
      return queryBuilder.getMany();
    }
  }

  async findByTenantMongoId(
    ctx: RequestContext,
    tenantMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    // This method requires mongoId columns, so if they don't exist, return empty array
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { tenantMongoId },
        relations: relations || ["workspace", "artisan", "productionOrder"],
        order: { startDate: "DESC" },
      });
    } else {
      // Column doesn't exist, can't query by it
      return [];
    }
  }

  async findByWorkspace(
    ctx: RequestContext,
    workspaceId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { workspaceId },
        relations: relations || ["artisan", "productionOrder", "createdByUser"],
        order: { startDate: "DESC" },
      });
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder
        .where("timesheet.workspaceId = :workspaceId", { workspaceId })
        .orderBy("timesheet.startDate", "DESC");
      return queryBuilder.getMany();
    }
  }

  async findByWorkspaceMongoId(
    ctx: RequestContext,
    workspaceMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    // This method requires mongoId columns, so if they don't exist, return empty array
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { workspaceMongoId },
        relations: relations || ["artisan", "productionOrder", "createdByUser"],
        order: { startDate: "DESC" },
      });
    } else {
      // Column doesn't exist, can't query by it
      return [];
    }
  }

  async findByArtisan(
    ctx: RequestContext,
    artisanId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { artisanId },
        relations: relations || [
          "workspace",
          "productionOrder",
          "createdByUser",
        ],
        order: { startDate: "DESC" },
      });
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder
        .where("timesheet.artisanId = :artisanId", { artisanId })
        .orderBy("timesheet.startDate", "DESC");
      return queryBuilder.getMany();
    }
  }

  async findByArtisanMongoId(
    ctx: RequestContext,
    artisanMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    // This method requires mongoId columns, so if they don't exist, return empty array
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { artisanMongoId },
        relations: relations || [
          "workspace",
          "productionOrder",
          "createdByUser",
        ],
        order: { startDate: "DESC" },
      });
    } else {
      // Column doesn't exist, can't query by it
      return [];
    }
  }

  async findByCreatedByMongoId(
    ctx: RequestContext,
    createdByMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    // This method requires mongoId columns, so if they don't exist, return empty array
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { createdByMongoId },
        relations: relations || ["workspace", "artisan", "productionOrder"],
        order: { startDate: "DESC" },
      });
    } else {
      // Column doesn't exist, can't query by it
      return [];
    }
  }

  async findByProductionOrder(
    ctx: RequestContext,
    productionOrderId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
        where: { productionOrderId },
        relations: relations || ["workspace", "artisan", "createdByUser"],
        order: { startDate: "ASC" },
      });
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder
        .where("timesheet.productionOrderId = :productionOrderId", {
          productionOrderId,
        })
        .orderBy("timesheet.startDate", "ASC");
      return queryBuilder.getMany();
    }
  }

  async findByDateRange(
    ctx: RequestContext,
    startDate: Date,
    endDate: Date,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      return this.connection
        .getRepository(ctx, ArtisanTaskTimesheet)
        .createQueryBuilder("timesheet")
        .where("timesheet.startDate >= :startDate", { startDate })
        .andWhere("timesheet.startDate <= :endDate", { endDate })
        .leftJoinAndSelect("timesheet.artisan", "artisan")
        .leftJoinAndSelect("timesheet.productionOrder", "productionOrder")
        .orderBy("timesheet.startDate", "ASC")
        .getMany();
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder
        .where("timesheet.startDate >= :startDate", { startDate })
        .andWhere("timesheet.startDate <= :endDate", { endDate })
        .orderBy("timesheet.startDate", "ASC");
      // Skip productionOrder relation to avoid column issues
      return queryBuilder.getMany();
    }
  }

  async findActiveTimesheets(
    ctx: RequestContext,
    artisanId?: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    if (hasMongoIdColumns) {
      const queryBuilder = this.connection
        .getRepository(ctx, ArtisanTaskTimesheet)
        .createQueryBuilder("timesheet")
        .where("timesheet.endDate IS NULL")
        .leftJoinAndSelect("timesheet.artisan", "artisan")
        .leftJoinAndSelect("timesheet.productionOrder", "productionOrder");

      if (artisanId) {
        queryBuilder.andWhere("timesheet.artisanId = :artisanId", {
          artisanId,
        });
      }

      return queryBuilder.getMany();
    } else {
      const queryBuilder = await this.createSafeQueryBuilder(ctx);
      queryBuilder.where("timesheet.endDate IS NULL");

      if (artisanId) {
        queryBuilder.andWhere("timesheet.artisanId = :artisanId", {
          artisanId,
        });
      }

      // Skip productionOrder relation to avoid column issues
      return queryBuilder.getMany();
    }
  }

  async create(
    ctx: RequestContext,
    input: CreateArtisanTaskTimesheetInput
  ): Promise<ArtisanTaskTimesheet> {
    const timesheetRepo = this.connection.getRepository(
      ctx,
      ArtisanTaskTimesheet
    );
    const workspaceRepo = this.connection.getRepository(ctx, Workspace);
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );

    // Verify workspace exists
    const workspace = await workspaceRepo.findOne({
      where: { id: input.workspaceId },
    });
    if (!workspace) {
      throw new Error(`Workspace with id ${input.workspaceId} not found`);
    }

    // Verify artisan exists
    const artisan = await userRepo.findOne({ where: { id: input.artisanId } });
    if (!artisan) {
      throw new Error(`Artisan user with id ${input.artisanId} not found`);
    }

    // Verify createdBy user exists
    const createdByUser = await userRepo.findOne({
      where: { id: input.createdBy },
    });
    if (!createdByUser) {
      throw new Error(`User with id ${input.createdBy} not found`);
    }

    // Verify production order exists if provided
    // Use count instead of findOne to avoid loading columns that might not exist yet
    if (input.productionOrderId) {
      const productionOrderCount = await productionOrderRepo.count({
        where: { id: input.productionOrderId },
      });
      if (productionOrderCount === 0) {
        throw new Error(
          `Production order with id ${input.productionOrderId} not found`
        );
      }
    }

    // Check if mongoId columns exist before trying to insert
    // This avoids transaction abort issues in PostgreSQL
    const hasMongoIdColumns = await this.checkColumnExists(
      ctx,
      "artisan_task_timesheet",
      "tenantMongoId"
    );

    let savedTimesheet: ArtisanTaskTimesheet;
    if (hasMongoIdColumns) {
      // All columns exist, insert with all fields
      const timesheet = timesheetRepo.create({
        tenantId: input.tenantId,
        tenantMongoId: input.tenantMongoId,
        workspaceId: input.workspaceId,
        workspaceMongoId: input.workspaceMongoId,
        artisanId: input.artisanId,
        artisanMongoId: input.artisanMongoId,
        startDate: input.startDate,
        endDate: input.endDate,
        rate: input.rate,
        rateType: input.rateType,
        productionOrderId: input.productionOrderId,
        rework: input.rework || false,
        productive: input.productive !== undefined ? input.productive : true,
        reason: input.reason,
        createdBy: input.createdBy,
        createdByMongoId: input.createdByMongoId,
      });

      savedTimesheet = await timesheetRepo.save(timesheet);
    } else {
      // Migration hasn't run yet, insert without mongoId columns
      const timesheetWithoutMongoIds = timesheetRepo.create({
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        artisanId: input.artisanId,
        startDate: input.startDate,
        endDate: input.endDate,
        rate: input.rate,
        rateType: input.rateType,
        productionOrderId: input.productionOrderId,
        rework: input.rework || false,
        productive: input.productive !== undefined ? input.productive : true,
        reason: input.reason,
        createdBy: input.createdBy,
      });

      savedTimesheet = await timesheetRepo.save(timesheetWithoutMongoIds);
    }

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ArtisanTaskTimesheet,
        input,
        savedTimesheet
      );
    }

    // Preserve MongoDB IDs from saved entity before reloading
    // (They might not be loaded by findOneById due to select: false decorator)
    const preservedMongoIds = {
      tenantMongoId: savedTimesheet.tenantMongoId,
      workspaceMongoId: savedTimesheet.workspaceMongoId,
      artisanMongoId: savedTimesheet.artisanMongoId,
      createdByMongoId: savedTimesheet.createdByMongoId,
    };

    // Try to reload with relations, but handle missing columns gracefully
    try {
      const reloadedTimesheet = await this.findOneById(ctx, savedTimesheet.id);

      // Restore MongoDB IDs that might have been lost during reload
      // (due to select: false decorator in entity)
      if (reloadedTimesheet && hasMongoIdColumns) {
        reloadedTimesheet.tenantMongoId = preservedMongoIds.tenantMongoId;
        reloadedTimesheet.workspaceMongoId = preservedMongoIds.workspaceMongoId;
        reloadedTimesheet.artisanMongoId = preservedMongoIds.artisanMongoId;
        reloadedTimesheet.createdByMongoId = preservedMongoIds.createdByMongoId;
      }

      return reloadedTimesheet as ArtisanTaskTimesheet;
    } catch (error: any) {
      // If error is about missing columns, just return the saved timesheet without reloading
      if (
        error.message &&
        (error.message.includes("does not exist") ||
          error.message.includes("column") ||
          error.code === "42703")
      ) {
        // Return saved timesheet which already has MongoDB IDs
        return savedTimesheet;
      }
      throw error;
    }
  }

  async update(
    ctx: RequestContext,
    input: UpdateArtisanTaskTimesheetInput
  ): Promise<ArtisanTaskTimesheet> {
    const timesheetRepo = this.connection.getRepository(
      ctx,
      ArtisanTaskTimesheet
    );
    const { id, customFields, ...updateData } = input;

    const timesheet = await this.findOneById(ctx, id);
    if (!timesheet) {
      throw new Error(`Timesheet with id ${id} not found`);
    }

    // Check if mongoId columns exist before trying to update them
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    // If mongoId columns don't exist, remove them from updateData
    if (!hasMongoIdColumns) {
      delete (updateData as any).workspaceMongoId;
      delete (updateData as any).artisanMongoId;
    }

    Object.assign(timesheet, updateData);

    try {
      await timesheetRepo.save(timesheet);
    } catch (error: any) {
      // If error is about missing columns, try again without mongoId fields
      if (
        error.message &&
        (error.message.includes("does not exist") ||
          error.message.includes("column") ||
          error.code === "42703")
      ) {
        delete (updateData as any).workspaceMongoId;
        delete (updateData as any).artisanMongoId;
        Object.assign(timesheet, updateData);
        await timesheetRepo.save(timesheet);
      } else {
        throw error;
      }
    }

    // Handle custom fields
    if (customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ArtisanTaskTimesheet,
        input,
        timesheet
      );
    }

    try {
      return this.findOneById(ctx, id) as Promise<ArtisanTaskTimesheet>;
    } catch (error: any) {
      // If error is about missing columns, just return the saved timesheet
      if (
        error.message &&
        (error.message.includes("does not exist") ||
          error.message.includes("column") ||
          error.code === "42703")
      ) {
        return timesheet;
      }
      throw error;
    }
  }

  async stopTimesheet(
    ctx: RequestContext,
    input: StopTimesheetInput
  ): Promise<ArtisanTaskTimesheet> {
    const timesheetRepo = this.connection.getRepository(
      ctx,
      ArtisanTaskTimesheet
    );
    const { id, endDate } = input;

    const timesheet = await this.findOneById(ctx, id);
    if (!timesheet) {
      throw new Error(`Timesheet with id ${id} not found`);
    }

    if (timesheet.endDate) {
      throw new Error(`Timesheet with id ${id} is already stopped`);
    }

    timesheet.endDate = endDate;
    await timesheetRepo.save(timesheet);
    return this.findOneById(ctx, id) as Promise<ArtisanTaskTimesheet>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, ArtisanTaskTimesheet)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Get timesheet statistics
  async getStatistics(
    ctx: RequestContext,
    tenantId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalHours: number;
    totalCost: number;
    productiveHours: number;
    reworkHours: number;
    nonProductiveHours: number;
  }> {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    let query;
    if (hasMongoIdColumns) {
      const timesheetRepo = this.connection.getRepository(
        ctx,
        ArtisanTaskTimesheet
      );
      query = timesheetRepo
        .createQueryBuilder("timesheet")
        .where("timesheet.tenantId = :tenantId", { tenantId })
        .andWhere("timesheet.endDate IS NOT NULL");
    } else {
      query = await this.createSafeQueryBuilder(ctx);
      query
        .where("timesheet.tenantId = :tenantId", { tenantId })
        .andWhere("timesheet.endDate IS NOT NULL");
    }

    if (startDate && endDate) {
      query = query
        .andWhere("timesheet.startDate >= :startDate", { startDate })
        .andWhere("timesheet.startDate <= :endDate", { endDate });
    }

    const timesheets = await query.getMany();

    let totalHours = 0;
    let totalCost = 0;
    let productiveHours = 0;
    let reworkHours = 0;
    let nonProductiveHours = 0;

    timesheets.forEach((timesheet) => {
      const hours = timesheet.getTimeSpentInHours();
      const cost = timesheet.calculateTotalCost();

      totalHours += hours;
      totalCost += cost;

      if (!timesheet.productive) {
        nonProductiveHours += hours;
      } else if (timesheet.rework) {
        reworkHours += hours;
      } else {
        productiveHours += hours;
      }
    });

    return {
      totalHours,
      totalCost,
      productiveHours,
      reworkHours,
      nonProductiveHours,
    };
  }

  // Helper method to check if a column exists in a table
  // Uses information_schema which is safe to query in a transaction
  private async checkColumnExists(
    ctx: RequestContext,
    tableName: string,
    columnName: string
  ): Promise<boolean> {
    try {
      // Query information_schema - this is safe even in aborted transactions
      // We use current_schema() to check the current schema, defaulting to 'public'
      const result = await this.connection
        .getRepository(ctx, ArtisanTaskTimesheet)
        .query(
          `SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = COALESCE(current_schema(), 'public')
            AND table_name = $1 
            AND column_name = $2
          ) AS exists`,
          [tableName, columnName]
        );
      return result && result[0]?.exists === true;
    } catch (error) {
      // If query fails for any reason, assume column doesn't exist
      // This is safe as it will fall back to inserting without mongoId columns
      return false;
    }
  }

  // Cached helper to check if mongoId columns exist
  private async getHasMongoIdColumns(ctx: RequestContext): Promise<boolean> {
    if (this.hasMongoIdColumnsCache === null) {
      this.hasMongoIdColumnsCache = await this.checkColumnExists(
        ctx,
        "artisan_task_timesheet",
        "tenantMongoId"
      );
    }
    return this.hasMongoIdColumnsCache;
  }

  // Helper to create a query builder with only existing columns
  private async createSafeQueryBuilder(
    ctx: RequestContext,
    alias: string = "timesheet"
  ) {
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);
    const queryBuilder = this.connection
      .getRepository(ctx, ArtisanTaskTimesheet)
      .createQueryBuilder(alias)
      .select([
        `${alias}.id`,
        `${alias}.tenantId`,
        `${alias}.workspaceId`,
        `${alias}.artisanId`,
        `${alias}.startDate`,
        `${alias}.endDate`,
        `${alias}.timeSpent`,
        `${alias}.rate`,
        `${alias}.rateType`,
        `${alias}.productionOrderId`,
        `${alias}.rework`,
        `${alias}.productive`,
        `${alias}.reason`,
        `${alias}.created`,
        `${alias}.createdBy`,
      ])
      .leftJoinAndSelect(`${alias}.workspace`, "workspace")
      .leftJoinAndSelect(`${alias}.artisan`, "artisan")
      .leftJoinAndSelect(`${alias}.createdByUser`, "createdByUser");

    // Add mongoId columns if they exist
    if (hasMongoIdColumns) {
      queryBuilder.addSelect([
        `${alias}.tenantMongoId`,
        `${alias}.workspaceMongoId`,
        `${alias}.artisanMongoId`,
        `${alias}.createdByMongoId`,
      ]);
    }

    return queryBuilder;
  }

  // Get artisan productivity report
  async getArtisanProductivityReport(
    ctx: RequestContext,
    artisanId: number,
    startDate: Date,
    endDate: Date
  ): Promise<{
    artisan: TenantUser;
    totalHours: number;
    productiveHours: number;
    reworkHours: number;
    nonProductiveHours: number;
    efficiency: number;
  }> {
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const hasMongoIdColumns = await this.getHasMongoIdColumns(ctx);

    const artisan = await userRepo.findOne({ where: { id: artisanId } });
    if (!artisan) {
      throw new Error(`Artisan with id ${artisanId} not found`);
    }

    let query;
    if (hasMongoIdColumns) {
      const timesheetRepo = this.connection.getRepository(
        ctx,
        ArtisanTaskTimesheet
      );
      query = timesheetRepo
        .createQueryBuilder("timesheet")
        .where("timesheet.artisanId = :artisanId", { artisanId })
        .andWhere("timesheet.startDate >= :startDate", { startDate })
        .andWhere("timesheet.startDate <= :endDate", { endDate })
        .andWhere("timesheet.endDate IS NOT NULL");
    } else {
      query = await this.createSafeQueryBuilder(ctx);
      query
        .where("timesheet.artisanId = :artisanId", { artisanId })
        .andWhere("timesheet.startDate >= :startDate", { startDate })
        .andWhere("timesheet.startDate <= :endDate", { endDate })
        .andWhere("timesheet.endDate IS NOT NULL");
    }

    const timesheets = await query.getMany();

    let totalHours = 0;
    let productiveHours = 0;
    let reworkHours = 0;
    let nonProductiveHours = 0;

    timesheets.forEach((timesheet) => {
      const hours = timesheet.getTimeSpentInHours();

      totalHours += hours;

      if (!timesheet.productive) {
        nonProductiveHours += hours;
      } else if (timesheet.rework) {
        reworkHours += hours;
      } else {
        productiveHours += hours;
      }
    });

    const efficiency =
      totalHours > 0 ? (productiveHours / totalHours) * 100 : 0;

    return {
      artisan,
      totalHours,
      productiveHours,
      reworkHours,
      nonProductiveHours,
      efficiency,
    };
  }
}
