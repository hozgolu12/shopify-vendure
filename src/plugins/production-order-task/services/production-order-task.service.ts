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
import { ProductionOrderTask } from "../entities/production-order-task.entity";
import { TenantUser } from "../../tenant-user/entities/user.entity";
import { Workspace } from "../../tenant-workspace/entities/tenant-workspace.entity";
import { ProductionOrder } from "../../production-order/entities/production-order.entity";
import { TaskStatus } from "../types";
import {
  CreateProductionOrderTaskInput,
  UpdateProductionOrderTaskInput,
  UpdateTaskStatusInput,
  AssignTaskInput,
} from "../types";

@Injectable()
export class ProductionOrderTaskService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ProductionOrderTask>,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<PaginatedList<ProductionOrderTask>> {
    return this.listQueryBuilder
      .build(ProductionOrderTask, options, {
        relations: relations || [
          "workspace",
          "productionOrder",
          "createdByUser",
          "supervisorUser",
          "parent",
          "subTasks",
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
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask | null> {
    return this.connection.getRepository(ctx, ProductionOrderTask).findOne({
      where: { id: id as any },
      relations: relations || [
        "workspace",
        "productionOrder",
        "createdByUser",
        "supervisorUser",
        "parent",
        "subTasks",
      ],
    });
  }

  async findByProductionOrder(
    ctx: RequestContext,
    productionOrderId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { productionOrderId },
      relations: relations || [
        "createdByUser",
        "supervisorUser",
        "parent",
        "subTasks",
      ],
      order: { createdAt: "ASC" },
    });
  }

  async findByTenant(
    ctx: RequestContext,
    tenantId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { tenantId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findByTenantMongoId(
    ctx: RequestContext,
    tenantMongoId: string,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { tenantMongoId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findByWorkspace(
    ctx: RequestContext,
    workspaceId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { workspaceId },
      relations: relations || [
        "productionOrder",
        "createdByUser",
        "supervisorUser",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByWorkspaceMongoId(
    ctx: RequestContext,
    workspaceMongoId: string,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { workspaceMongoId },
      relations: relations || [
        "productionOrder",
        "createdByUser",
        "supervisorUser",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findByStatus(
    ctx: RequestContext,
    status: TaskStatus,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { status },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findByAssignee(
    ctx: RequestContext,
    userId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);

    return taskRepo
      .createQueryBuilder("task")
      .where("JSON_CONTAINS(task.assignees, :userId)", { userId })
      .leftJoinAndSelect("task.productionOrder", "productionOrder")
      .leftJoinAndSelect("task.createdByUser", "createdByUser")
      .leftJoinAndSelect("task.supervisorUser", "supervisorUser")
      .orderBy("task.createdAt", "DESC")
      .getMany();
  }

  async findByAssigneesMongoId(
    ctx: RequestContext,
    assigneeMongoId: string,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);

    return taskRepo
      .createQueryBuilder("task")
      .where("JSON_CONTAINS(task.assigneesMongoId, :assigneeMongoId)", {
        assigneeMongoId: JSON.stringify(assigneeMongoId),
      })
      .leftJoinAndSelect("task.productionOrder", "productionOrder")
      .leftJoinAndSelect("task.createdByUser", "createdByUser")
      .leftJoinAndSelect("task.supervisorUser", "supervisorUser")
      .orderBy("task.createdAt", "DESC")
      .getMany();
  }

  async findBySupervisor(
    ctx: RequestContext,
    supervisorId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { supervisor: supervisorId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findBySupervisorMongoId(
    ctx: RequestContext,
    supervisorMongoId: string,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { supervisorMongoId },
      relations: relations || ["workspace", "productionOrder", "createdByUser"],
      order: { createdAt: "DESC" },
    });
  }

  async findByCreatedByMongoId(
    ctx: RequestContext,
    createdByMongoId: string,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { createdByMongoId },
      relations: relations || [
        "workspace",
        "productionOrder",
        "supervisorUser",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findSubTasks(
    ctx: RequestContext,
    parentId: number,
    relations?: RelationPaths<ProductionOrderTask>
  ): Promise<ProductionOrderTask[]> {
    return this.connection.getRepository(ctx, ProductionOrderTask).find({
      where: { parentId },
      relations: relations || ["createdByUser", "supervisorUser", "subTasks"],
      order: { createdAt: "ASC" },
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateProductionOrderTaskInput
  ): Promise<ProductionOrderTask> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);
    const workspaceRepo = this.connection.getRepository(ctx, Workspace);
    const productionOrderRepo = this.connection.getRepository(
      ctx,
      ProductionOrder
    );
    const userRepo = this.connection.getRepository(ctx, TenantUser);

    // Verify workspace exists
    const workspace = await workspaceRepo.findOne({
      where: { id: input.workspaceId },
    });
    if (!workspace) {
      throw new Error(`Workspace with id ${input.workspaceId} not found`);
    }

    // Verify production order exists
    const productionOrder = await productionOrderRepo.findOne({
      where: { id: input.productionOrderId },
    });
    if (!productionOrder) {
      throw new Error(
        `Production order with id ${input.productionOrderId} not found`
      );
    }

    // Verify createdBy user exists
    const createdByUser = await userRepo.findOne({
      where: { id: input.createdBy },
    });
    if (!createdByUser) {
      throw new Error(`User with id ${input.createdBy} not found`);
    }

    // Verify parent task exists if provided
    if (input.parentId) {
      const parentTask = await taskRepo.findOne({
        where: { id: input.parentId },
      });
      if (!parentTask) {
        throw new Error(`Parent task with id ${input.parentId} not found`);
      }
    }

    // Verify supervisor exists if provided
    if (input.supervisor) {
      const supervisorUser = await userRepo.findOne({
        where: { id: input.supervisor },
      });
      if (!supervisorUser) {
        throw new Error(
          `Supervisor user with id ${input.supervisor} not found`
        );
      }
    }

    const task = taskRepo.create({
      parentId: input.parentId,
      tenantId: input.tenantId,
      tenantMongoId: input.tenantMongoId,
      workspaceId: input.workspaceId,
      workspaceMongoId: input.workspaceMongoId,
      productionOrderId: input.productionOrderId,
      status: input.status || TaskStatus.TODO,
      startDate: input.startDate,
      endDate: input.endDate,
      assignees: input.assignees || [],
      assigneesMongoId: input.assigneesMongoId || [],
      supervisor: input.supervisor,
      supervisorMongoId: input.supervisorMongoId,
      dependencies: input.dependencies || [],
      remarks: input.remarks,
      createdBy: input.createdBy,
      createdByMongoId: input.createdByMongoId,
    });

    const savedTask = await taskRepo.save(task);

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductionOrderTask,
        input,
        savedTask
      );
    }

    return this.findOneById(ctx, savedTask.id) as Promise<ProductionOrderTask>;
  }

  async update(
    ctx: RequestContext,
    input: UpdateProductionOrderTaskInput
  ): Promise<ProductionOrderTask> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);
    const { id, customFields, ...updateData } = input;

    const task = await this.findOneById(ctx, id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Verify parent task exists if provided
    if (updateData.parentId !== undefined) {
      if (updateData.parentId === null) {
        task.parentId = undefined as any;
      } else {
        const parentTask = await taskRepo.findOne({
          where: { id: updateData.parentId },
        });
        if (!parentTask) {
          throw new Error(
            `Parent task with id ${updateData.parentId} not found`
          );
        }
        task.parentId = updateData.parentId;
      }
    }

    Object.assign(task, updateData);
    await taskRepo.save(task);

    // Handle custom fields
    if (customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductionOrderTask,
        input,
        task
      );
    }

    return this.findOneById(ctx, id) as Promise<ProductionOrderTask>;
  }

  async updateStatus(
    ctx: RequestContext,
    input: UpdateTaskStatusInput
  ): Promise<ProductionOrderTask> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);
    const { id, status } = input;

    const task = await this.findOneById(ctx, id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    task.status = status;
    await taskRepo.save(task);
    return this.findOneById(ctx, id) as Promise<ProductionOrderTask>;
  }

  async assignTask(
    ctx: RequestContext,
    input: AssignTaskInput
  ): Promise<ProductionOrderTask> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);
    const userRepo = this.connection.getRepository(ctx, TenantUser);
    const { id, assignees, supervisor } = input;

    const task = await this.findOneById(ctx, id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Verify all assignees exist
    for (const userId of assignees) {
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
    }

    // Verify supervisor exists if provided
    if (supervisor) {
      const supervisorUser = await userRepo.findOne({
        where: { id: supervisor },
      });
      if (!supervisorUser) {
        throw new Error(`Supervisor user with id ${supervisor} not found`);
      }
    }

    task.assignees = assignees;
    if (supervisor !== undefined) {
      task.supervisor = supervisor;
    }

    await taskRepo.save(task);
    return this.findOneById(ctx, id) as Promise<ProductionOrderTask>;
  }

  async addDependency(
    ctx: RequestContext,
    taskId: ID,
    dependencyTaskId: number
  ): Promise<ProductionOrderTask> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);

    const task = await this.findOneById(ctx, taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    // Verify dependency task exists
    const dependencyTask = await taskRepo.findOne({
      where: { id: dependencyTaskId },
    });
    if (!dependencyTask) {
      throw new Error(`Dependency task with id ${dependencyTaskId} not found`);
    }

    // Add dependency if not already present
    if (!task.dependencies.includes(dependencyTaskId)) {
      task.dependencies.push(dependencyTaskId);
      await taskRepo.save(task);
    }

    return this.findOneById(ctx, taskId) as Promise<ProductionOrderTask>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, ProductionOrderTask)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Get task statistics by status
  async getStatisticsByStatus(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ status: TaskStatus; count: number }[]> {
    const taskRepo = this.connection.getRepository(ctx, ProductionOrderTask);

    return taskRepo
      .createQueryBuilder("task")
      .select("task.status", "status")
      .addSelect("COUNT(task.id)", "count")
      .where("task.tenantId = :tenantId", { tenantId })
      .groupBy("task.status")
      .getRawMany();
  }
}
