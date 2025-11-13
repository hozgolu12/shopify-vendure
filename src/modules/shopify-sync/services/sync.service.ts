import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { VendureService } from './vendure.service';
import { SettingsService } from './settings.service';
import { mapShopifyProductToVendure, mapShopifyCustomerToVendure } from '../utils/mappers';

/**
 * SyncService
 *
 * Orchestrates the synchronization of data from Shopify to Vendure.
 * Supports:
 * - Product sync with variants
 * - Customer sync with addresses
 * - Order sync (informational only; full creation not implemented)
 * - Combined "sync all" workflow
 *
 * All operations use GraphQL exclusively and support idempotent updates.
 */
@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);

  constructor(
    private shopifyService: ShopifyService,
    private vendureService: VendureService,
    private settingsService: SettingsService,
  ) {}

  /**
   * Sync products from Shopify to Vendure
   *
   * @param channelId - Channel ID to sync for
   * @param afterDate - Optional ISO date string for incremental sync
   * @returns Sync statistics
   */
  async syncProducts(channelId: string, afterDate?: string) {
    const settings = this.settingsService.getSettings(channelId);
    if (!settings) {
      throw new BadRequestException(`No settings found for channel: ${channelId}`);
    }

    this.logger.log(`Starting product sync for channel: ${channelId}`);

    const stats = {
      productsCreated: 0,
      productsUpdated: 0,
      variantsCreated: 0,
      errors: [] as string[],
    };

    try {
      // Fetch all products from Shopify
      const shopifyProducts = await this.shopifyService.fetchAllProducts(
        settings.shopifyStore,
        settings.shopifyAccessToken,
        afterDate,
      );

      const vendureAdminUrl = settings.vendureAdminUrl || 'http://localhost:3000';
      const vendureChannelId = settings.vendureChannelId || 'default';

      // Process each product
      for (const shopifyProduct of shopifyProducts) {
        try {
          // Map Shopify product to Vendure format
          const vendureProductInput = mapShopifyProductToVendure(shopifyProduct);

          // Create or update product in Vendure
          const { isNew } = await this.vendureService.createOrUpdateProduct(
            vendureAdminUrl,
            settings.vendureAdminToken,
            vendureProductInput,
            vendureChannelId,
          );

          if (isNew) {
            stats.productsCreated++;
          } else {
            stats.productsUpdated++;
          }

          // Create variants (if product is new or needs variant updates)
          const productId = vendureProductInput.id;
          if (shopifyProduct.variants?.edges) {
            for (const variantEdge of shopifyProduct.variants.edges) {
              const shopifyVariant = variantEdge.node;
              const variantInput = {
                name: shopifyVariant.title || shopifyProduct.title,
                sku: shopifyVariant.sku || `${shopifyProduct.handle}-${shopifyVariant.id}`,
                price: shopifyVariant.price ? Math.round(parseFloat(shopifyVariant.price) * 100) : 0,
                trackInventory: true,
                customFields: {
                  shopifyVariantId: shopifyVariant.id,
                },
                translations: [
                  {
                    languageCode: 'en',
                    name: shopifyVariant.title || shopifyProduct.title,
                    description: '',
                  },
                ],
              };

              await this.vendureService.createProductVariant(
                vendureAdminUrl,
                settings.vendureAdminToken,
                productId,
                variantInput,
              );

              stats.variantsCreated++;
            }
          }
        } catch (error: any) {
          const msg = `Failed to sync product ${shopifyProduct.id}: ${error.message}`;
          this.logger.error(msg);
          stats.errors.push(msg);
        }
      }
    } catch (error: any) {
      const msg = `Product sync failed: ${error.message}`;
      this.logger.error(msg);
      stats.errors.push(msg);
    }

    this.logger.log(
      `Product sync complete. Created: ${stats.productsCreated}, Updated: ${stats.productsUpdated}, Errors: ${stats.errors.length}`,
    );

    return stats;
  }

  /**
   * Sync customers from Shopify to Vendure
   *
   * @param channelId - Channel ID to sync for
   * @returns Sync statistics
   */
  async syncCustomers(channelId: string) {
    const settings = this.settingsService.getSettings(channelId);
    if (!settings) {
      throw new BadRequestException(`No settings found for channel: ${channelId}`);
    }

    this.logger.log(`Starting customer sync for channel: ${channelId}`);

    const stats = {
      customersCreated: 0,
      customersUpdated: 0,
      errors: [] as string[],
    };

    try {
      // Fetch all customers from Shopify
      const shopifyCustomers = await this.shopifyService.fetchAllCustomers(
        settings.shopifyStore,
        settings.shopifyAccessToken,
      );

      const vendureAdminUrl = settings.vendureAdminUrl || 'http://localhost:3000';

      // Process each customer
      for (const shopifyCustomer of shopifyCustomers) {
        try {
          // Map Shopify customer to Vendure format
          const vendureCustomerInput = mapShopifyCustomerToVendure(shopifyCustomer);

          // Create or update customer in Vendure
          const { isNew } = await this.vendureService.createOrUpdateCustomer(
            vendureAdminUrl,
            settings.vendureAdminToken,
            vendureCustomerInput,
          );

          if (isNew) {
            stats.customersCreated++;
          } else {
            stats.customersUpdated++;
          }
        } catch (error: any) {
          const msg = `Failed to sync customer ${shopifyCustomer.id}: ${error.message}`;
          this.logger.error(msg);
          stats.errors.push(msg);
        }
      }
    } catch (error: any) {
      const msg = `Customer sync failed: ${error.message}`;
      this.logger.error(msg);
      stats.errors.push(msg);
    }

    this.logger.log(
      `Customer sync complete. Created: ${stats.customersCreated}, Updated: ${stats.customersUpdated}, Errors: ${stats.errors.length}`,
    );

    return stats;
  }

  /**
   * Sync orders from Shopify (informational; no DB writes)
   *
   * @param channelId - Channel ID to sync for
   * @returns Sync statistics with order info
   */
  async syncOrders(channelId: string) {
    const settings = this.settingsService.getSettings(channelId);
    if (!settings) {
      throw new BadRequestException(`No settings found for channel: ${channelId}`);
    }

    this.logger.log(`Starting order sync for channel: ${channelId}`);

    const stats = {
      ordersProcessed: 0,
      ordersMapped: [] as any[],
      errors: [] as string[],
    };

    try {
      // Fetch all orders from Shopify
      const shopifyOrders = await this.shopifyService.fetchAllOrders(
        settings.shopifyStore,
        settings.shopifyAccessToken,
      );

      // Map orders (no creation in Vendure yet; this is informational)
      for (const order of shopifyOrders) {
        try {
          const mappedOrder = {
            shopifyId: order.id,
            shopifyName: order.name,
            email: order.email || order.customer?.email,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            items: order.lineItems?.edges?.map((le: any) => ({
              title: le.node.title,
              quantity: le.node.quantity,
              price: le.node.originalUnitPrice,
              variantId: le.node.variant?.id,
              sku: le.node.variant?.sku,
            })) || [],
          };

          stats.ordersMapped.push(mappedOrder);
          stats.ordersProcessed++;
        } catch (error: any) {
          const msg = `Failed to map order ${order.id}: ${error.message}`;
          this.logger.error(msg);
          stats.errors.push(msg);
        }
      }
    } catch (error: any) {
      const msg = `Order sync failed: ${error.message}`;
      this.logger.error(msg);
      stats.errors.push(msg);
    }

    this.logger.log(`Order sync complete. Processed: ${stats.ordersProcessed}, Errors: ${stats.errors.length}`);

    return stats;
  }

  /**
   * Sync all data (products, customers, orders) sequentially
   *
   * @param channelId - Channel ID to sync for
   * @param afterDate - Optional ISO date for incremental product sync
   * @returns Combined sync statistics
   */
  async syncAll(channelId: string, afterDate?: string) {
    this.logger.log(`Starting full sync for channel: ${channelId}`);

    const productStats = await this.syncProducts(channelId, afterDate);
    const customerStats = await this.syncCustomers(channelId);
    const orderStats = await this.syncOrders(channelId);

    const combinedStats = {
      productsCreated: productStats.productsCreated,
      productsUpdated: productStats.productsUpdated,
      customersCreated: customerStats.customersCreated,
      customersUpdated: customerStats.customersUpdated,
      ordersProcessed: orderStats.ordersProcessed,
      totalErrors: productStats.errors.length + customerStats.errors.length + orderStats.errors.length,
      errors: [...productStats.errors, ...customerStats.errors, ...orderStats.errors],
    };

    this.logger.log(`Full sync complete for channel: ${channelId}`);
    return combinedStats;
  }
}
