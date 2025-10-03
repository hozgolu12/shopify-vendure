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
import { Workspace } from "../entities/tenant-workspace.entity";
import { MeasurementField } from "../entities/tenant-measurement.entity";

interface CreateWorkspaceInput {
  userId: ID;
  organizationId?: string;
  workspaceName: string;
  productLine: string;
  statuses: string[];
  workstations: string[];
  sizeSystems: string[];
  measurementFields?: Array<{
    fieldName: string;
    selectedValues: string[];
  }>;
  customFields?: any;
}

interface UpdateWorkspaceInput {
  id: ID;
  organizationId?: string;
  workspaceName?: string;
  productLine?: string;
  statuses?: string[];
  workstations?: string[];
  sizeSystems?: string[];
  measurementFields?: Array<{
    fieldName: string;
    selectedValues: string[];
  }>;
  customFields?: any;
}

@Injectable()
export class WorkspaceService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Workspace>,
    relations?: RelationPaths<Workspace>
  ): Promise<PaginatedList<Workspace>> {
    return this.listQueryBuilder
      .build(Workspace, options, {
        relations: relations || ["user", "measurementFields"],
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
    relations?: RelationPaths<Workspace>
  ): Promise<Workspace | null> {
    return this.connection.getRepository(ctx, Workspace).findOne({
      where: { id: id as any },
      relations: relations || ["user", "measurementFields"],
    });
  }

  async findByUserId(
    ctx: RequestContext,
    userId: ID,
    relations?: RelationPaths<Workspace>
  ): Promise<Workspace[]> {
    return this.connection.getRepository(ctx, Workspace).find({
      where: { userId: userId as any },
      relations: relations || ["measurementFields"],
    });
  }

  async findByOrganizationId(
    ctx: RequestContext,
    organizationId: string,
    relations?: RelationPaths<Workspace>
  ): Promise<Workspace[]> {
    return this.connection.getRepository(ctx, Workspace).find({
      where: { organizationId },
      relations: relations || ["user", "measurementFields"],
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateWorkspaceInput
  ): Promise<Workspace> {
    const workspaceRepo = this.connection.getRepository(ctx, Workspace);
    const measurementFieldRepo = this.connection.getRepository(
      ctx,
      MeasurementField
    );

    // Create main workspace
    const workspace = workspaceRepo.create({
      userId: input.userId as number,
      organizationId: input.organizationId,
      workspaceName: input.workspaceName,
      productLine: input.productLine,
      statuses: input.statuses,
      workstations: input.workstations,
      sizeSystems: input.sizeSystems,
    });

    const savedWorkspace = await workspaceRepo.save(workspace);

    // Create measurement fields if provided
    if (input.measurementFields && input.measurementFields.length > 0) {
      const measurementFields = input.measurementFields.map((mf) =>
        measurementFieldRepo.create({
          ...mf,
          workspace: savedWorkspace,
        })
      );
      savedWorkspace.measurementFields = await measurementFieldRepo.save(
        measurementFields
      );
    }

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        Workspace,
        input,
        savedWorkspace
      );
    }

    return this.findOneById(ctx, savedWorkspace.id) as Promise<Workspace>;
  }

  async update(
    ctx: RequestContext,
    input: UpdateWorkspaceInput
  ): Promise<Workspace> {
    const workspaceRepo = this.connection.getRepository(ctx, Workspace);
    const measurementFieldRepo = this.connection.getRepository(
      ctx,
      MeasurementField
    );
    const { id, customFields, measurementFields, ...updateData } = input;

    // Update main workspace fields
    await workspaceRepo.update(id, updateData);

    // Update measurement fields if provided
    if (measurementFields) {
      // First remove existing measurement fields
      const existingWorkspace = await this.findOneById(ctx, id);
      if (existingWorkspace && existingWorkspace.measurementFields) {
        await measurementFieldRepo.remove(existingWorkspace.measurementFields);
      }

      // Create new measurement fields
      if (measurementFields.length > 0) {
        const newMeasurementFields = measurementFields.map((mf) =>
          measurementFieldRepo.create({
            ...mf,
            workspace: { id: id as number } as Workspace,
          })
        );
        await measurementFieldRepo.save(newMeasurementFields);
      }
    }

    // Handle custom fields
    if (customFields) {
      const entity = await workspaceRepo.findOne({ where: { id: id as any } });
      if (entity) {
        await this.customFieldRelationService.updateRelations(
          ctx,
          Workspace,
          input,
          entity
        );
      }
    }

    return this.findOneById(ctx, id) as Promise<Workspace>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, Workspace)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Helper method to add a single measurement field
  async addMeasurementField(
    ctx: RequestContext,
    workspaceId: ID,
    measurementField: {
      fieldName: string;
      selectedValues: string[];
    }
  ): Promise<Workspace> {
    const measurementFieldRepo = this.connection.getRepository(
      ctx,
      MeasurementField
    );

    const workspace = await this.findOneById(ctx, workspaceId);
    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const newMeasurementField = measurementFieldRepo.create({
      ...measurementField,
      workspace,
    });

    await measurementFieldRepo.save(newMeasurementField);
    return this.findOneById(ctx, workspaceId) as Promise<Workspace>;
  }

  // Helper method to remove a measurement field
  async removeMeasurementField(
    ctx: RequestContext,
    measurementFieldId: ID
  ): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, MeasurementField)
      .delete(measurementFieldId);
    return result.affected ? result.affected > 0 : false;
  }
}
