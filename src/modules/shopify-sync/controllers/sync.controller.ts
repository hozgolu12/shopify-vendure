import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { SettingsService } from '../services/settings.service';
import { SaveSettingsDto } from '../dtos/save-settings.dto';
import { SyncRequestDto, SyncResponseDto, SettingsResponseDto } from '../dtos/sync-request.dto';

/**
 * ShopifySyncController
 *
 * REST endpoints for:
 * - Saving and retrieving Shopify/Vendure settings per channel
 * - Triggering manual syncs for products, customers, orders
 * - Monitoring sync status and statistics
 *
 * All endpoints require channelId as a path/query parameter to identify
 * which channel's settings to use for the sync.
 */
@Controller('shopify-sync')
export class ShopifySyncController {
  private logger = new Logger(ShopifySyncController.name);

  constructor(
    private syncService: SyncService,
    private settingsService: SettingsService,
  ) {}

  /**
   * POST /shopify-sync/settings/save
   *
   * Save Shopify API credentials and Vendure configuration for a channel.
   *
   * Request body:
   * {
   *   "channelId": "default",
   *   "shopifyStore": "my-store.myshopify.com",
   *   "shopifyAccessToken": "shpat_xxxxxx",
   *   "vendureAdminToken": "token_xxxx",
   *   "vendureAdminUrl": "http://localhost:3000",
   *   "vendureChannelId": "default"
   * }
   *
   * Response:
   * { "success": true, "message": "Settings saved for channel: default" }
   */
  @Post('settings/save')
  async saveSettings(@Body() dto: SaveSettingsDto): Promise<{ success: boolean; message: string }> {
    try {
      this.settingsService.saveSettings(dto.channelId, {
        shopifyStore: dto.shopifyStore,
        shopifyAccessToken: dto.shopifyAccessToken,
        vendureAdminToken: dto.vendureAdminToken,
        vendureAdminUrl: dto.vendureAdminUrl || 'http://localhost:3000',
        vendureChannelId: dto.vendureChannelId || 'default',
      });

      this.logger.log(`Settings saved for channel: ${dto.channelId}`);
      return { success: true, message: `Settings saved for channel: ${dto.channelId}` };
    } catch (error: any) {
      this.logger.error(`Failed to save settings: ${error.message}`);
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * GET /shopify-sync/settings/:channelId
   *
   * Retrieve settings for a channel (without sensitive tokens).
   *
   * Response:
   * {
   *   "channelId": "default",
   *   "shopifyStore": "my-store.myshopify.com",
   *   "vendureChannelId": "default",
   *   "vendureAdminUrl": "http://localhost:3000"
   * }
   */
  @Get('settings/:channelId')
  async getSettings(@Param('channelId') channelId: string): Promise<SettingsResponseDto> {
    const settings = this.settingsService.getSettings(channelId);
    if (!settings) {
      throw new HttpException(
        { success: false, message: `No settings found for channel: ${channelId}` },
        HttpStatus.NOT_FOUND,
      );
    }

    // Return settings without sensitive tokens
    return {
      channelId,
      shopifyStore: settings.shopifyStore,
      vendureChannelId: settings.vendureChannelId,
      vendureAdminUrl: settings.vendureAdminUrl,
    };
  }

  /**
   * POST /shopify-sync/products/sync
   *
   * Trigger a product sync from Shopify to Vendure for a given channel.
   *
   * Request body:
   * {
   *   "channelId": "default",
   *   "afterDate": "2024-01-01T00:00:00Z"  // optional, for incremental sync
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Product sync completed",
   *   "stats": {
   *     "productsCreated": 10,
   *     "productsUpdated": 5,
   *     "errors": 0
   *   }
   * }
   */
  @Post('products/sync')
  async syncProducts(@Body() dto: SyncRequestDto): Promise<SyncResponseDto> {
    try {
      const stats = await this.syncService.syncProducts(dto.channelId, dto.afterDate);

      return {
        success: true,
        message: 'Product sync completed',
        stats,
      };
    } catch (error: any) {
      this.logger.error(`Product sync failed: ${error.message}`);
      throw new HttpException(
        { success: false, message: error.message, errors: [error.message] },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /shopify-sync/customers/sync
   *
   * Trigger a customer sync from Shopify to Vendure.
   *
   * Request body:
   * { "channelId": "default" }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Customer sync completed",
   *   "stats": {
   *     "customersCreated": 50,
   *     "customersUpdated": 20,
   *     "errors": 0
   *   }
   * }
   */
  @Post('customers/sync')
  async syncCustomers(@Body() dto: SyncRequestDto): Promise<SyncResponseDto> {
    try {
      const stats = await this.syncService.syncCustomers(dto.channelId);

      return {
        success: true,
        message: 'Customer sync completed',
        stats,
      };
    } catch (error: any) {
      this.logger.error(`Customer sync failed: ${error.message}`);
      throw new HttpException(
        { success: false, message: error.message, errors: [error.message] },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /shopify-sync/orders/sync
   *
   * Fetch and map orders from Shopify (no DB creation; informational only).
   *
   * Request body:
   * { "channelId": "default" }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Order sync completed",
   *   "stats": {
   *     "ordersProcessed": 100,
   *     "errors": 0
   *   }
   * }
   */
  @Post('orders/sync')
  async syncOrders(@Body() dto: SyncRequestDto): Promise<SyncResponseDto> {
    try {
      const stats = await this.syncService.syncOrders(dto.channelId);

      return {
        success: true,
        message: 'Order sync completed',
        stats,
      };
    } catch (error: any) {
      this.logger.error(`Order sync failed: ${error.message}`);
      throw new HttpException(
        { success: false, message: error.message, errors: [error.message] },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /shopify-sync/all/sync
   *
   * Trigger a complete sync: products, customers, and orders.
   *
   * Request body:
   * {
   *   "channelId": "default",
   *   "afterDate": "2024-01-01T00:00:00Z"  // optional
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Full sync completed",
   *   "stats": {
   *     "productsCreated": 10,
   *     "productsUpdated": 5,
   *     "customersCreated": 50,
   *     "customersUpdated": 20,
   *     "ordersProcessed": 100,
   *     "totalErrors": 0
   *   }
   * }
   */
  @Post('all/sync')
  async syncAll(@Body() dto: SyncRequestDto): Promise<SyncResponseDto> {
    try {
      const stats = await this.syncService.syncAll(dto.channelId, dto.afterDate);

      return {
        success: true,
        message: 'Full sync completed',
        stats,
      };
    } catch (error: any) {
      this.logger.error(`Full sync failed: ${error.message}`);
      throw new HttpException(
        { success: false, message: error.message, errors: [error.message] },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * GET /shopify-sync/channels
   *
   * List all channels that have saved settings (for monitoring/admin purposes).
   *
   * Response:
   * {
   *   "channels": ["default", "client-a", "client-b"]
   * }
   */
  @Get('channels')
  async listChannels(): Promise<{ channels: string[] }> {
    const channels = this.settingsService.getAllChannelIds();
    return { channels };
  }
}
