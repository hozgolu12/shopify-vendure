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
  tenantMongoId: string;
  workspaceId: number;
  workspaceMongoId: string;
  artisanId: number;
  artisanMongoId: string;
  startDate: Date;
  endDate?: Date;
  rate: number;
  rateType: "hourly" | "daily";
  productionOrderId?: number;
  rework?: boolean;
  productive?: boolean;
  reason?: string;
  createdBy: number;
  createdByMongoId: string;
  customFields?: any;
}

interface UpdateArtisanTaskTimesheetInput {
  id: ID;
  workspaceId?: number;
  artisanId?: number;
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
  }

  async findOneById(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet | null> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).findOne({
      where: { id: id as any },
      relations: relations || [
        "workspace",
        "artisan",
        "productionOrder",
        "createdByUser",
      ],
    });
  }

  async findByTenant(
    ctx: RequestContext,
    tenantId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { tenantId },
      relations: relations || ["workspace", "artisan", "productionOrder"],
      order: { startDate: "DESC" },
    });
  }

  async findByTenantMongoId(
    ctx: RequestContext,
    tenantMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { tenantMongoId },
      relations: relations || ["workspace", "artisan", "productionOrder"],
      order: { startDate: "DESC" },
    });
  }

  async findByWorkspace(
    ctx: RequestContext,
    workspaceId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { workspaceId },
      relations: relations || ["artisan", "productionOrder", "createdByUser"],
      order: { startDate: "DESC" },
    });
  }

  async findByWorkspaceMongoId(
    ctx: RequestContext,
    workspaceMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { workspaceMongoId },
      relations: relations || ["artisan", "productionOrder", "createdByUser"],
      order: { startDate: "DESC" },
    });
  }

  async findByArtisan(
    ctx: RequestContext,
    artisanId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { artisanId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { startDate: "DESC" },
    });
  }

  async findByArtisanMongoId(
    ctx: RequestContext,
    artisanMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { artisanMongoId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { startDate: "DESC" },
    });
  }

  async findByCreatedByMongoId(
    ctx: RequestContext,
    createdByMongoId: string,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { createdByMongoId },
      relations: relations || ["workspace", "artisan", "productionOrder"],
      order: { startDate: "DESC" },
    });
  }

  async findByProductionOrder(
    ctx: RequestContext,
    productionOrderId: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection.getRepository(ctx, ArtisanTaskTimesheet).find({
      where: { productionOrderId },
      relations: relations || ["workspace", "artisan", "createdByUser"],
      order: { startDate: "ASC" },
    });
  }

  async findByDateRange(
    ctx: RequestContext,
    startDate: Date,
    endDate: Date,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    return this.connection
      .getRepository(ctx, ArtisanTaskTimesheet)
      .createQueryBuilder("timesheet")
      .where("timesheet.startDate >= :startDate", { startDate })
      .andWhere("timesheet.startDate <= :endDate", { endDate })
      .leftJoinAndSelect("timesheet.artisan", "artisan")
      .leftJoinAndSelect("timesheet.productionOrder", "productionOrder")
      .orderBy("timesheet.startDate", "ASC")
      .getMany();
  }

  async findActiveTimesheets(
    ctx: RequestContext,
    artisanId?: number,
    relations?: RelationPaths<ArtisanTaskTimesheet>
  ): Promise<ArtisanTaskTimesheet[]> {
    const queryBuilder = this.connection
      .getRepository(ctx, ArtisanTaskTimesheet)
      .createQueryBuilder("timesheet")
      .where("timesheet.endDate IS NULL")
      .leftJoinAndSelect("timesheet.artisan", "artisan")
      .leftJoinAndSelect("timesheet.productionOrder", "productionOrder");

    if (artisanId) {
      queryBuilder.andWhere("timesheet.artisanId = :artisanId", { artisanId });
    }

    return queryBuilder.getMany();
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
    if (input.productionOrderId) {
      const productionOrder = await productionOrderRepo.findOne({
        where: { id: input.productionOrderId },
      });
      if (!productionOrder) {
        throw new Error(
          `Production order with id ${input.productionOrderId} not found`
        );
      }
    }

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

    const savedTimesheet = await timesheetRepo.save(timesheet);

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ArtisanTaskTimesheet,
        input,
        savedTimesheet
      );
    }

    return this.findOneById(
      ctx,
      savedTimesheet.id
    ) as Promise<ArtisanTaskTimesheet>;
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

    Object.assign(timesheet, updateData);
    await timesheetRepo.save(timesheet);

    // Handle custom fields
    if (customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ArtisanTaskTimesheet,
        input,
        timesheet
      );
    }

    return this.findOneById(ctx, id) as Promise<ArtisanTaskTimesheet>;
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
    const timesheetRepo = this.connection.getRepository(
      ctx,
      ArtisanTaskTimesheet
    );

    let query = timesheetRepo
      .createQueryBuilder("timesheet")
      .where("timesheet.tenantId = :tenantId", { tenantId })
      .andWhere("timesheet.endDate IS NOT NULL");

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
    const timesheetRepo = this.connection.getRepository(
      ctx,
      ArtisanTaskTimesheet
    );
    const userRepo = this.connection.getRepository(ctx, TenantUser);

    const artisan = await userRepo.findOne({ where: { id: artisanId } });
    if (!artisan) {
      throw new Error(`Artisan with id ${artisanId} not found`);
    }

    const timesheets = await timesheetRepo
      .createQueryBuilder("timesheet")
      .where("timesheet.artisanId = :artisanId", { artisanId })
      .andWhere("timesheet.startDate >= :startDate", { startDate })
      .andWhere("timesheet.startDate <= :endDate", { endDate })
      .andWhere("timesheet.endDate IS NOT NULL")
      .getMany();

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
