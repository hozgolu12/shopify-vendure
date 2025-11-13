/**
 * Sync request DTO for triggering syncs
 */
export class SyncRequestDto {
  /**
   * Channel ID to sync for (must have saved settings)
   */
  channelId: string;

  /**
   * Optional: only sync products after this date (ISO string)
   * Used for incremental syncs. If not provided, all products are synced.
   */
  afterDate?: string;

  /**
   * Optional: override the stored Vendure channel ID for this sync
   */
  vendureChannelIdOverride?: string;
}

/**
 * Response DTO after sync completion
 */
export class SyncResponseDto {
  success: boolean;
  message: string;
  stats?: any; // Flexible stats object to accommodate different sync types
  errors?: string[];
}

/**
 * Settings response DTO
 */
export class SettingsResponseDto {
  channelId: string;
  shopifyStore: string;
  vendureChannelId?: string;
  vendureAdminUrl?: string;
  // Note: accessTokens are never returned for security
}
