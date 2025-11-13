import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

/**
 * DTO for saving Shopify API credentials and Vendure configuration per channel/tenant
 */
export class SaveSettingsDto {
  /**
   * Channel ID in Vendure (e.g., 'default', 'client-a').
   * Used as the key to store and retrieve settings.
   */
  @IsString()
  @IsNotEmpty()
  channelId: string;

  /**
   * Shopify store URL (e.g., 'my-store.myshopify.com').
   * Used to construct GraphQL endpoint URLs.
   */
  @IsString()
  @IsNotEmpty()
  shopifyStore: string;

  /**
   * Shopify Admin GraphQL API access token.
   * Must have scopes: read_products, read_customers, read_orders.
   * Stored securely (consider using HashiCorp Vault or encrypted env vars in production).
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  shopifyAccessToken: string;

  /**
   * Vendure Admin API token for authentication.
   * Used to authenticate requests to the Vendure Admin GraphQL endpoint.
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  vendureAdminToken: string;

  /**
   * Vendure Admin GraphQL endpoint URL.
   * Default: http://localhost:3000/admin-api (can be customized per environment).
   * Optional if provided via config or environment.
   */
  @IsString()
  @IsOptional()
  vendureAdminUrl?: string;

  /**
   * Shopify sales channel to Vendure channel mapping (optional).
   * If provided, synced products will be assigned to this channel.
   * Can be extended for multi-channel mapping logic.
   */
  @IsString()
  @IsOptional()
  vendureChannelId?: string;
}
