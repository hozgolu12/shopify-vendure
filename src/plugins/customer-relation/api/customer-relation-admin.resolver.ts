import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ForbiddenError,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { Customer } from "@vendure/core";
import { RelationService } from "../services/customer-relation.service";

// Shop Resolvers (unchanged)
@Resolver("Customer")
export class RelationShopResolver {
  constructor(private relationService: RelationService) {}

  @ResolveField()
  @Allow(Permission.Owner)
  async outgoingRelations(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer
  ) {
    const activeCustomer = await this.relationService.getActiveCustomer(ctx);
    if (activeCustomer.id !== customer.id) {
      throw new ForbiddenError();
    }
    const relations = await this.relationService.getOutgoingRelations(ctx);
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }

  @ResolveField()
  @Allow(Permission.Owner)
  async incomingRelations(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer
  ) {
    const activeCustomer = await this.relationService.getActiveCustomer(ctx);
    if (activeCustomer.id !== customer.id) {
      throw new ForbiddenError();
    }
    const relations = await this.relationService.getIncomingRelations(ctx);
    return relations.map((r) => ({ customer: r.fromCustomer, type: r.type }));
  }
}

@Resolver()
export class RelationShopMutationResolver {
  constructor(private relationService: RelationService) {}

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async addRelation(
    @Ctx() ctx: RequestContext,
    @Args("toCustomerId") toCustomerId: string,
    @Args("type") type: string
  ) {
    const relations = await this.relationService.addRelation(
      ctx,
      toCustomerId,
      type
    );
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async removeRelation(
    @Ctx() ctx: RequestContext,
    @Args("toCustomerId") toCustomerId: string,
    @Args("type") type: string
  ) {
    const relations = await this.relationService.removeRelation(
      ctx,
      toCustomerId,
      type
    );
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }
}

// New Admin Resolvers
@Resolver("Customer")
export class RelationAdminResolver {
  constructor(private relationService: RelationService) {}

  @ResolveField()
  @Allow(Permission.ReadCustomer)
  async outgoingRelations(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer
  ) {
    const relations = await this.relationService.getOutgoingForCustomer(
      ctx,
      customer.id
    );
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }

  @ResolveField()
  @Allow(Permission.ReadCustomer)
  async incomingRelations(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer
  ) {
    const relations = await this.relationService.getIncomingForCustomer(
      ctx,
      customer.id
    );
    return relations.map((r) => ({ customer: r.fromCustomer, type: r.type }));
  }
}

@Resolver()
export class RelationAdminMutationResolver {
  constructor(private relationService: RelationService) {}

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCustomer)
  async addRelationForCustomer(
    @Ctx() ctx: RequestContext,
    @Args("fromCustomerId") fromCustomerId: string,
    @Args("toCustomerId") toCustomerId: string,
    @Args("type") type: string
  ) {
    const relations = await this.relationService.addRelationForCustomer(
      ctx,
      fromCustomerId,
      toCustomerId,
      type
    );
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCustomer)
  async removeRelationForCustomer(
    @Ctx() ctx: RequestContext,
    @Args("fromCustomerId") fromCustomerId: string,
    @Args("toCustomerId") toCustomerId: string,
    @Args("type") type: string
  ) {
    const relations = await this.relationService.removeRelationForCustomer(
      ctx,
      fromCustomerId,
      toCustomerId,
      type
    );
    return relations.map((r) => ({ customer: r.toCustomer, type: r.type }));
  }
}
