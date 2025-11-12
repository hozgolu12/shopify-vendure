import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Allow, Permission, Transaction } from "@vendure/core";
import { ShopifyService } from "../services/shopify.service";
import { TenantShopifySettings } from "../entities/tenant-shopify-settings.entity";

@Resolver()
export class ShopifyAdminResolver {
  constructor(private shopifyService: ShopifyService) {}

  @Query()
  @Allow(Permission.SuperAdmin, Permission.ReadCatalog)
  async shopifySettingsByTenant(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ): Promise<TenantShopifySettings | null> {
    return this.shopifyService.getSettingsByTenant(ctx, args.tenantId);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async upsertShopifySettings(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<TenantShopifySettings> {
    return this.shopifyService.upsertSettings(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  async syncShopifyProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ) {
    return this.shopifyService.syncProductsForTenant(ctx, args.tenantId);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  async syncShopifyCustomers(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ) {
    return this.shopifyService.syncCustomersForTenant(ctx, args.tenantId);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  async syncShopifyOrders(
    @Ctx() ctx: RequestContext,
    @Args() args: { tenantId: number }
  ) {
    return this.shopifyService.syncOrdersForTenant(ctx, args.tenantId);
  }
}
