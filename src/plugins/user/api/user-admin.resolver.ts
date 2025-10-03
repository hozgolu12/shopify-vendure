import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Allow, Permission, ID } from "@vendure/core";
import { UserService } from "../services/user.service";
import { TenantUser } from "../entities/user.entity";

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  @Allow(Permission.Authenticated)
  async userByBetterAuthId(
    @Ctx() ctx: RequestContext,
    @Args() args: { betterAuthId: string }
  ): Promise<TenantUser | null> {
    return this.userService.findOneByBetterAuthId(args.betterAuthId);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async currentUser(@Ctx() ctx: RequestContext): Promise<TenantUser | null> {
    const betterAuthId = (ctx as any).session?.user?.betterAuthId;
    if (!betterAuthId) {
      return null;
    }
    return this.userService.findOneByBetterAuthId(betterAuthId);
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async users(@Ctx() ctx: RequestContext): Promise<TenantUser[]> {
    return this.userService.findAllLegacy();
  }

  @Mutation()
  @Allow(Permission.Public)
  async createUser(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<TenantUser> {
    return this.userService.createUser(args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async updateUser(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<TenantUser> {
    return this.userService.updateUser(args.input);
  }

  @Mutation()
  @Allow(Permission.Public)
  async upsertUser(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<TenantUser> {
    return this.userService.upsertUser(args.input);
  }
}
