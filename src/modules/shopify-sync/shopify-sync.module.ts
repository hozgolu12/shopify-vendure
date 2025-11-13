import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShopifySyncController } from './controllers/sync.controller';
import { ShopifyService } from './services/shopify.service';
import { VendureService } from './services/vendure.service';
import { SyncService } from './services/sync.service';
import { SettingsService } from './services/settings.service';

/**
 * Shopify-Vendure Sync Module
 *
 * Provides a self-contained, modular approach to syncing Shopify data into Vendure
 * using GraphQL APIs exclusively. Supports:
 * - Settings management for Shopify API credentials per tenant/channel
 * - Manual sync triggers for products, customers, orders
 * - GraphQL-only integration with Shopify and Vendure
 * - No database schema changes; credentials stored in in-memory (or Redis if extended)
 * - No plugins or entity modifications
 *
 * Usage:
 * Import this module into your app.module.ts:
 *   @Module({
 *     imports: [ShopifySyncModule],
 *   })
 *   export class AppModule {}
 *
 * Then call REST endpoints:
 *   POST   /shopify-sync/settings/save
 *   GET    /shopify-sync/settings/:channelId
 *   POST   /shopify-sync/products/sync
 *   POST   /shopify-sync/customers/sync
 *   POST   /shopify-sync/orders/sync
 *   POST   /shopify-sync/all/sync
 */
@Module({
  imports: [ConfigModule],
  controllers: [ShopifySyncController],
  providers: [ShopifyService, VendureService, SyncService, SettingsService],
  exports: [ShopifyService, VendureService, SyncService, SettingsService],
})
export class ShopifySyncModule {}
