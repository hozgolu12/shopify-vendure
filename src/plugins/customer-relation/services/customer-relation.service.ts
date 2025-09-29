import { Injectable } from "@nestjs/common";
import {
  Customer,
  ForbiddenError,
  ID,
  InternalServerError,
  RequestContext,
  TransactionalConnection,
  UserInputError,
} from "@vendure/core";
import { Relation } from "../entities/customer-relation.entity";

@Injectable()
export class RelationService {
  constructor(private connection: TransactionalConnection) {}

  // Existing methods for Shop (active customer)
  async getOutgoingRelations(
    ctx: RequestContext
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const customer = await this.getActiveCustomer(ctx);
    return this.getOutgoingForCustomer(ctx, customer.id);
  }

  async getIncomingRelations(
    ctx: RequestContext
  ): Promise<Array<{ fromCustomer: Customer; type: string }>> {
    const customer = await this.getActiveCustomer(ctx);
    return this.getIncomingForCustomer(ctx, customer.id);
  }

  async addRelation(
    ctx: RequestContext,
    toCustomerId: ID,
    type: string
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const customer = await this.getActiveCustomer(ctx);
    return this.addRelationForCustomer(ctx, customer.id, toCustomerId, type);
  }

  async removeRelation(
    ctx: RequestContext,
    toCustomerId: ID,
    type: string
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const customer = await this.getActiveCustomer(ctx);
    return this.removeRelationForCustomer(ctx, customer.id, toCustomerId, type);
  }

  // New methods for Admin (any customer)
  async getOutgoingForCustomer(
    ctx: RequestContext,
    customerId: ID
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const relations = await this.connection.getRepository(ctx, Relation).find({
      where: { fromCustomerId: customerId },
      relations: ["toCustomer"],
    });
    return relations.map((r) => ({ toCustomer: r.toCustomer, type: r.type }));
  }

  async getIncomingForCustomer(
    ctx: RequestContext,
    customerId: ID
  ): Promise<Array<{ fromCustomer: Customer; type: string }>> {
    const relations = await this.connection.getRepository(ctx, Relation).find({
      where: { toCustomerId: customerId },
      relations: ["fromCustomer"],
    });
    return relations.map((r) => ({
      fromCustomer: r.fromCustomer,
      type: r.type,
    }));
  }

  async addRelationForCustomer(
    ctx: RequestContext,
    fromCustomerId: ID,
    toCustomerId: ID,
    type: string
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const fromCustomer = await this.connection
      .getRepository(ctx, Customer)
      .findOne({ where: { id: fromCustomerId } });
    if (!fromCustomer) {
      throw new UserInputError(`No customer with ID ${fromCustomerId} found`);
    }
    if (fromCustomerId === toCustomerId) {
      throw new UserInputError("Cannot add a relation to the same customer");
    }
    if (!type || type.trim() === "") {
      throw new UserInputError("Relation type must be provided");
    }

    const toCustomer = await this.connection
      .getRepository(ctx, Customer)
      .findOne({ where: { id: toCustomerId } });
    if (!toCustomer) {
      throw new UserInputError(`No customer with ID ${toCustomerId} found`);
    }

    const existing = await this.connection
      .getRepository(ctx, Relation)
      .findOne({
        where: { fromCustomerId, toCustomerId, type },
      });
    if (existing) {
      return this.getOutgoingForCustomer(ctx, fromCustomerId);
    }

    const relation = new Relation({
      fromCustomerId,
      toCustomerId,
      type,
    });
    await this.connection.getRepository(ctx, Relation).save(relation);

    return this.getOutgoingForCustomer(ctx, fromCustomerId);
  }

  async removeRelationForCustomer(
    ctx: RequestContext,
    fromCustomerId: ID,
    toCustomerId: ID,
    type: string
  ): Promise<Array<{ toCustomer: Customer; type: string }>> {
    const existing = await this.connection
      .getRepository(ctx, Relation)
      .findOne({
        where: { fromCustomerId, toCustomerId, type },
      });
    if (existing) {
      await this.connection.getRepository(ctx, Relation).remove(existing);
    }

    return this.getOutgoingForCustomer(ctx, fromCustomerId);
  }

  async getActiveCustomer(ctx: RequestContext): Promise<Customer> {
    if (!ctx.activeUserId) {
      throw new ForbiddenError();
    }
    const customer = await this.connection
      .getRepository(ctx, Customer)
      .findOne({
        where: { user: { id: ctx.activeUserId } },
      });
    if (!customer) {
      throw new InternalServerError("Active customer not found");
    }
    return customer;
  }
}
