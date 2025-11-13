/**
 * Export all public APIs from the Shopify-Vendure Sync Module
 * 
 * Usage:
 * import { ShopifySyncModule, SyncService } from './modules/shopify-sync';
 */

export { ShopifySyncModule } from './shopify-sync.module';

// Controllers
export { ShopifySyncController } from './controllers/sync.controller';

// Services
export { ShopifyService } from './services/shopify.service';
export { VendureService } from './services/vendure.service';
export { SyncService } from './services/sync.service';
export { SettingsService } from './services/settings.service';

// DTOs
export { SaveSettingsDto } from './dtos/save-settings.dto';
export { SyncRequestDto, SyncResponseDto, SettingsResponseDto } from './dtos/sync-request.dto';

// Constants
export {
  SHOPIFY_API_VERSION,
  VENDURE_ADMIN_API_PATH,
  SETTINGS_STORE_PREFIX,
  SHOPIFY_PAGE_SIZE,
  GQL_QUERY_TIMEOUT_MS,
  GQL_MAX_RETRIES,
} from './constants/sync.constants';

// Utilities
export {
  mapShopifyProductToVendure,
  mapShopifyCustomerToVendure,
  mapShopifyOrderToVendure,
  slugify,
  mapSalesChannelToVendureChannel,
} from './utils/mappers';
