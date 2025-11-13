import { Injectable, Logger } from '@nestjs/common';

/**
 * SettingsService
 *
 * Manages Shopify API credentials and Vendure configuration for each channel.
 * Currently uses in-memory storage; can be extended to use Redis, database, or Vault.
 *
 * In production, use encrypted storage and proper secret management:
 * - HashiCorp Vault
 * - AWS Secrets Manager
 * - Azure Key Vault
 * - Redis with encryption
 * - Database with encrypted columns
 */
@Injectable()
export class SettingsService {
  private logger = new Logger(SettingsService.name);
  private settings = new Map<string, any>();

  /**
   * Save settings for a channel
   *
   * @param channelId - Channel identifier
   * @param settings - Settings object with Shopify and Vendure credentials
   */
  saveSettings(
    channelId: string,
    settings: {
      shopifyStore: string;
      shopifyAccessToken: string;
      vendureAdminToken: string;
      vendureAdminUrl?: string;
      vendureChannelId?: string;
    },
  ): void {
    this.settings.set(channelId, {
      ...settings,
      savedAt: new Date().toISOString(),
    });
    this.logger.log(`Settings saved for channel: ${channelId}`);
  }

  /**
   * Get settings for a channel
   *
   * @param channelId - Channel identifier
   * @returns Settings object or null if not found
   */
  getSettings(
    channelId: string,
  ): {
    shopifyStore: string;
    shopifyAccessToken: string;
    vendureAdminToken: string;
    vendureAdminUrl?: string;
    vendureChannelId?: string;
  } | null {
    return this.settings.get(channelId) || null;
  }

  /**
   * Check if settings exist for a channel
   *
   * @param channelId - Channel identifier
   * @returns true if settings exist
   */
  hasSettings(channelId: string): boolean {
    return this.settings.has(channelId);
  }

  /**
   * Delete settings for a channel
   *
   * @param channelId - Channel identifier
   */
  deleteSettings(channelId: string): void {
    this.settings.delete(channelId);
    this.logger.log(`Settings deleted for channel: ${channelId}`);
  }

  /**
   * Get all channel IDs with saved settings
   *
   * @returns Array of channel IDs
   */
  getAllChannelIds(): string[] {
    return Array.from(this.settings.keys());
  }
}
