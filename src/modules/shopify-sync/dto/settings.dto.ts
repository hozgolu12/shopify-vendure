import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SaveShopifySettingsDto {
  @IsString()
  @IsNotEmpty()
  storeUrl: string;

  @IsString()
  @IsNotEmpty()
  apiToken: string;

  @IsOptional()
  @IsObject()
  channelMapping?: Record<string, string>; // { shopifySalesChannelId: vendureChannelId }
}

export class GetShopifySettingsDto {
  storeUrl: string;
  channelMapping?: Record<string, string>;
  // apiToken is NOT returned for security
}

export class SyncProductsRequestDto {
  @IsOptional()
  @IsString()
  channelId?: string; // Specific channel to sync to, or null for all mapped channels
}

export class SyncCustomersRequestDto {
  @IsOptional()
  @IsString()
  channelId?: string;
}

export class SyncOrdersRequestDto {
  @IsOptional()
  @IsString()
  channelId?: string;
}

export class SyncAllRequestDto {
  @IsOptional()
  @IsString()
  channelId?: string;
}

export class SyncResponseDto {
  status: 'success' | 'error';
  message: string;
  data?: {
    productsCreated?: number;
    productsUpdated?: number;
    customersCreated?: number;
    customersUpdated?: number;
    ordersCreated?: number;
    errors?: string[];
  };
}
