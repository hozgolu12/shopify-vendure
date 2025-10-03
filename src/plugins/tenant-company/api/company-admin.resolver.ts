import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Allow, Permission, ID } from "@vendure/core";
import { CompanyService } from "../services/company.service";
import { BesPosCompany } from "../entities/company.entity";

@Resolver()
export class TenantCompanyResolver {
  constructor(private companyService: CompanyService) {}

  @Query()
  @Allow(Permission.Authenticated)
  async besPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<BesPosCompany | null> {
    return this.companyService.findOneById(args.id);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async besPosCompanyByUserId(
    @Ctx() ctx: RequestContext,
    @Args() args: { userId: ID }
  ): Promise<BesPosCompany | null> {
    return this.companyService.findByUserId(args.userId);
  }

  @Query()
  @Allow(Permission.Authenticated)
  async myBesPosCompany(
    @Ctx() ctx: RequestContext
  ): Promise<BesPosCompany | null> {
    const userId = (ctx as any).session?.user?.id;
    if (!userId) {
      return null;
    }
    return this.companyService.findByUserId(userId);
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async besPosCompanies(@Ctx() ctx: RequestContext): Promise<BesPosCompany[]> {
    return this.companyService.findAll();
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async createBesPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<BesPosCompany> {
    return this.companyService.createCompany(args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async updateBesPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<BesPosCompany> {
    return this.companyService.updateCompany(args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async upsertBesPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<BesPosCompany> {
    return this.companyService.upsertCompany(args.input);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async addLocationToBesPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { companyId: ID; location: any }
  ): Promise<BesPosCompany> {
    return this.companyService.addLocation(args.companyId, args.location);
  }

  @Mutation()
  @Allow(Permission.Authenticated)
  async addWorkspaceToBesPosCompany(
    @Ctx() ctx: RequestContext,
    @Args() args: { companyId: ID; workspace: any }
  ): Promise<BesPosCompany> {
    return this.companyService.addWorkspace(args.companyId, args.workspace);
  }
}
