import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Allow,
  Permission,
  ID,
  Transaction,
} from "@vendure/core";
import { ProductKitService } from "../services/product-kit.service";
import { ProductKit } from "../entities/product-kit.entity";

@Resolver()
export class ProductKitResolver {
  constructor(private productKitService: ProductKitService) {}

  @Query()
  @Allow(
    Permission.SuperAdmin,
    Permission.UpdateCatalog,
    Permission.ReadCatalog
  )
  async productKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<ProductKit | null> {
    return this.productKitService.findOneById(ctx, args.id);
  }

  @Query()
  @Allow(
    Permission.SuperAdmin,
    Permission.UpdateCatalog,
    Permission.ReadCatalog
  )
  async productKits(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any }
  ): Promise<any> {
    return this.productKitService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(
    Permission.SuperAdmin,
    Permission.UpdateCatalog,
    Permission.ReadCatalog
  )
  async productKitByBarcode(
    @Ctx() ctx: RequestContext,
    @Args() args: { barcode: string; channelId: ID }
  ): Promise<ProductKit | null> {
    return this.productKitService.findByBarcodeAndChannel(
      ctx,
      args.barcode,
      args.channelId
    );
  }

  @Query()
  @Allow(
    Permission.SuperAdmin,
    Permission.UpdateCatalog,
    Permission.ReadCatalog
  )
  async productKitByName(
    @Ctx() ctx: RequestContext,
    @Args() args: { itemKitName: string; channelId: ID }
  ): Promise<ProductKit | null> {
    return this.productKitService.findByNameAndChannel(
      ctx,
      args.itemKitName,
      args.channelId
    );
  }

  @Query()
  @Allow(
    Permission.SuperAdmin,
    Permission.UpdateCatalog,
    Permission.ReadCatalog
  )
  async productKitsByChannel(
    @Ctx() ctx: RequestContext,
    @Args() args: { channelId: ID }
  ): Promise<ProductKit[]> {
    return this.productKitService.findByChannel(ctx, args.channelId);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async createProductKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductKit> {
    return this.productKitService.create(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async updateProductKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: any }
  ): Promise<ProductKit> {
    return this.productKitService.update(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async deleteProductKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<any> {
    const result = await this.productKitService.delete(ctx, args.id);
    return {
      result: result ? "DELETED" : "NOT_DELETED",
      message: result
        ? "Product kit deleted successfully"
        : "Failed to delete product kit",
    };
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async addProductVariantToKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { productKitId: ID; productVariantId: ID }
  ): Promise<ProductKit> {
    return this.productKitService.addProductVariantToKit(
      ctx,
      args.productKitId,
      args.productVariantId
    );
  }

  @Mutation()
  @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
  @Transaction()
  async removeProductVariantFromKit(
    @Ctx() ctx: RequestContext,
    @Args() args: { productKitId: ID; productVariantId: ID }
  ): Promise<ProductKit> {
    return this.productKitService.removeProductVariantFromKit(
      ctx,
      args.productKitId,
      args.productVariantId
    );
  }
}
