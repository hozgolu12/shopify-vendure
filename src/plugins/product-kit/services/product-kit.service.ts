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
  ProductVariant,
  Channel,
  Collection,
} from "@vendure/core";
import { ProductKit, DiscountType } from "../entities/product-kit.entity";

interface CreateProductKitInput {
  barcode: string;
  itemKitName: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  productVariantIds: ID[];
  productKitPrice: number;
  primaryProductId: ID; // Required primary product ID
  channelId: ID; // Single channel ID now
  collectionId: ID; // Required collection ID
  customFields?: any;
}

interface UpdateProductKitInput {
  id: ID;
  barcode?: string;
  itemKitName?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  productVariantIds?: ID[];
  productKitPrice?: number;
  primaryProductId?: ID; // Optional primary product update
  channelId?: ID; // Optional channel update
  collectionId?: ID; // Optional collection update
  customFields?: any;
}

@Injectable()
export class ProductKitService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ProductKit>,
    relations?: RelationPaths<ProductKit>
  ): Promise<PaginatedList<ProductKit>> {
    return this.listQueryBuilder
      .build(ProductKit, options, {
        relations: relations || [
          "productVariants",
          "primaryProduct",
          "channel",
          "collection",
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
    relations?: RelationPaths<ProductKit>
  ): Promise<ProductKit | null> {
    return this.connection.getRepository(ctx, ProductKit).findOne({
      where: { id: id as any },
      relations: relations || ["productVariants", "channel", "collection"],
    });
  }

  async findByBarcodeAndChannel(
    ctx: RequestContext,
    barcode: string,
    channelId: ID,
    relations?: RelationPaths<ProductKit>
  ): Promise<ProductKit | null> {
    return this.connection.getRepository(ctx, ProductKit).findOne({
      where: { barcode, channelId: channelId as any },
      relations: relations || ["productVariants", "channel", "collection"],
    });
  }

  async findByNameAndChannel(
    ctx: RequestContext,
    itemKitName: string,
    channelId: ID,
    relations?: RelationPaths<ProductKit>
  ): Promise<ProductKit | null> {
    return this.connection.getRepository(ctx, ProductKit).findOne({
      where: { itemKitName, channelId: channelId as any },
      relations: relations || ["productVariants", "channel", "collection"],
    });
  }

  async findByChannel(
    ctx: RequestContext,
    channelId: ID,
    relations?: RelationPaths<ProductKit>
  ): Promise<ProductKit[]> {
    return this.connection.getRepository(ctx, ProductKit).find({
      where: { channelId: channelId as any },
      relations: relations || ["productVariants", "channel", "collection"],
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateProductKitInput
  ): Promise<ProductKit> {
    const productKitRepo = this.connection.getRepository(ctx, ProductKit);
    const productVariantRepo = this.connection.getRepository(
      ctx,
      ProductVariant
    );
    const channelRepo = this.connection.getRepository(ctx, Channel);
    const collectionRepo = this.connection.getRepository(ctx, Collection);

    // Check if barcode already exists in the same channel
    const existingKitByBarcode = await this.findByBarcodeAndChannel(
      ctx,
      input.barcode,
      input.channelId
    );
    if (existingKitByBarcode) {
      throw new Error(
        `Product kit with barcode "${input.barcode}" already exists in this channel`
      );
    }

    // Check if name already exists in the same channel
    const existingKitByName = await this.findByNameAndChannel(
      ctx,
      input.itemKitName,
      input.channelId
    );
    if (existingKitByName) {
      throw new Error(
        `Product kit with name "${input.itemKitName}" already exists in this channel`
      );
    }

    // Load channel
    const channel = await channelRepo.findOne({
      where: { id: input.channelId as any },
    });
    if (!channel) {
      throw new Error(`Channel with id ${input.channelId} not found`);
    }

    // Load collection
    const collection = await collectionRepo.findOne({
      where: { id: input.collectionId as any },
    });
    if (!collection) {
      throw new Error(`Collection with id ${input.collectionId} not found`);
    }

    // Load primary product
    const primaryProduct = await productVariantRepo.findOne({
      where: { id: input.primaryProductId as any },
    });
    if (!primaryProduct) {
      throw new Error(
        `Primary product with id ${input.primaryProductId} not found`
      );
    }

    // Create main product kit
    const productKit = productKitRepo.create({
      barcode: input.barcode,
      itemKitName: input.itemKitName,
      description: input.description,
      discountType: input.discountType,
      discountValue: input.discountValue,
      productKitPrice: input.productKitPrice,
      primaryProduct,
      primaryProductId: input.primaryProductId as number,
      channel,
      channelId: input.channelId as number,
      collection,
      collectionId: input.collectionId as number,
    });

    // Load product variants
    if (input.productVariantIds.length > 0) {
      const productVariants = await productVariantRepo.findByIds(
        input.productVariantIds
      );
      productKit.productVariants = productVariants;
    }

    const savedProductKit = await productKitRepo.save(productKit);

    // Handle custom fields
    if (input.customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductKit,
        input,
        savedProductKit
      );
    }

    return this.findOneById(ctx, savedProductKit.id) as Promise<ProductKit>;
  }

  async update(
    ctx: RequestContext,
    input: UpdateProductKitInput
  ): Promise<ProductKit> {
    const productKitRepo = this.connection.getRepository(ctx, ProductKit);
    const productVariantRepo = this.connection.getRepository(
      ctx,
      ProductVariant
    );
    const channelRepo = this.connection.getRepository(ctx, Channel);
    const collectionRepo = this.connection.getRepository(ctx, Collection);

    const {
      id,
      customFields,
      productVariantIds,
      productKitPrice,
      primaryProductId,
      channelId,
      collectionId,
      ...updateData
    } = input;

    const productKit = await this.findOneById(ctx, id);
    if (!productKit) {
      throw new Error(`Product kit with id ${id} not found`);
    }

    // Check for duplicate barcode if barcode is being updated
    if (updateData.barcode && updateData.barcode !== productKit.barcode) {
      const existingKit = await this.findByBarcodeAndChannel(
        ctx,
        updateData.barcode,
        channelId || productKit.channelId
      );
      if (existingKit && existingKit.id !== id) {
        throw new Error(
          `Product kit with barcode "${updateData.barcode}" already exists in this channel`
        );
      }
    }

    // Check for duplicate name if name is being updated
    if (
      updateData.itemKitName &&
      updateData.itemKitName !== productKit.itemKitName
    ) {
      const existingKit = await this.findByNameAndChannel(
        ctx,
        updateData.itemKitName,
        channelId || productKit.channelId
      );
      if (existingKit && existingKit.id !== id) {
        throw new Error(
          `Product kit with name "${updateData.itemKitName}" already exists in this channel`
        );
      }
    }

    // Update channel if provided
    if (channelId) {
      const channel = await channelRepo.findOne({
        where: { id: channelId as any },
      });
      if (!channel) {
        throw new Error(`Channel with id ${channelId} not found`);
      }
      productKit.channel = channel;
      productKit.channelId = channelId as number;
    }

    // Update collection if provided
    if (collectionId) {
      const collection = await collectionRepo.findOne({
        where: { id: collectionId as any },
      });
      if (!collection) {
        throw new Error(`Collection with id ${collectionId} not found`);
      }
      productKit.collection = collection;
      productKit.collectionId = collectionId as number;
    }

    // Update primary product if provided
    if (primaryProductId) {
      const primaryProduct = await productVariantRepo.findOne({
        where: { id: primaryProductId as any },
      });
      if (!primaryProduct) {
        throw new Error(
          `Primary product with id ${primaryProductId} not found`
        );
      }
      productKit.primaryProduct = primaryProduct;
      productKit.primaryProductId = primaryProductId as number;
    }

    // Update basic fields
    Object.assign(productKit, updateData);

    // Update product variants if provided
    if (productVariantIds) {
      const productVariants = await productVariantRepo.findByIds(
        productVariantIds
      );
      productKit.productVariants = productVariants;
    }

    // Update product kit price if provided
    if (productKitPrice !== undefined) {
      productKit.productKitPrice = productKitPrice;
    }

    await productKitRepo.save(productKit);

    // Handle custom fields
    if (customFields) {
      await this.customFieldRelationService.updateRelations(
        ctx,
        ProductKit,
        input,
        productKit
      );
    }

    return this.findOneById(ctx, id) as Promise<ProductKit>;
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const result = await this.connection
      .getRepository(ctx, ProductKit)
      .delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Helper method to add product variant to kit
  async addProductVariantToKit(
    ctx: RequestContext,
    productKitId: ID,
    productVariantId: ID
  ): Promise<ProductKit> {
    const productKitRepo = this.connection.getRepository(ctx, ProductKit);
    const productVariantRepo = this.connection.getRepository(
      ctx,
      ProductVariant
    );

    const productKit = await this.findOneById(ctx, productKitId);
    if (!productKit) {
      throw new Error(`Product kit with id ${productKitId} not found`);
    }

    const productVariant = await productVariantRepo.findOne({
      where: { id: productVariantId as any },
    });
    if (!productVariant) {
      throw new Error(`Product variant with id ${productVariantId} not found`);
    }

    // Check if variant already exists in kit
    const existingVariant = productKit.productVariants.find(
      (v) => v.id === productVariantId
    );
    if (!existingVariant) {
      productKit.productVariants.push(productVariant);
      await productKitRepo.save(productKit);
    }

    return this.findOneById(ctx, productKitId) as Promise<ProductKit>;
  }

  // Helper method to remove product variant from kit
  async removeProductVariantFromKit(
    ctx: RequestContext,
    productKitId: ID,
    productVariantId: ID
  ): Promise<ProductKit> {
    const productKitRepo = this.connection.getRepository(ctx, ProductKit);

    const productKit = await this.findOneById(ctx, productKitId);
    if (!productKit) {
      throw new Error(`Product kit with id ${productKitId} not found`);
    }

    // Remove variant from kit
    productKit.productVariants = productKit.productVariants.filter(
      (v) => v.id !== productVariantId
    );
    await productKitRepo.save(productKit);

    return this.findOneById(ctx, productKitId) as Promise<ProductKit>;
  }
}
