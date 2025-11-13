# Shopify-Vendure Sync Module

A production-ready NestJS module for syncing Shopify data (products, customers, orders) into Vendure using **GraphQL APIs exclusively**. No database schema changes, no plugins, no migrations required.

## Features

✅ **GraphQL-Only Integration** — All Shopify and Vendure API calls use GraphQL exclusively  
✅ **No Schema Changes** — Works entirely via custom fields; no entity modifications  
✅ **Modular & Self-Contained** — Drop-in NestJS module with services, controllers, DTOs  
✅ **Multi-Channel Support** — Save settings per Vendure channel/tenant  
✅ **Idempotent Syncs** — Create or update products/customers based on custom fields  
✅ **Manual Triggers** — REST endpoints to sync on-demand; no background jobs or webhooks  
✅ **Comprehensive Mapping** — Shopify → Vendure field mapping with proper transformations  
✅ **Error Handling** — Detailed error logging and partial sync recovery  
✅ **Settings Management** — Secure credential storage (in-memory; extend with Redis/Vault)  

## Installation

### 1. Add Dependencies

Ensure your `package.json` has the required packages:

```bash
npm install axios class-validator class-transformer
```

If not already in your project:

```bash
npm install @nestjs/common @nestjs/core @nestjs/config
```

### 2. Import the Module

Add `ShopifySyncModule` to your app's imports:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ShopifySyncModule } from './modules/shopify-sync/shopify-sync.module';

@Module({
  imports: [
    // ... other imports
    ShopifySyncModule,
  ],
})
export class AppModule {}
```

### 3. Copy Module Files

Copy the entire `src/modules/shopify-sync/` directory into your project:

```
src/modules/shopify-sync/
├── shopify-sync.module.ts
├── controllers/
│   └── sync.controller.ts
├── services/
│   ├── shopify.service.ts
│   ├── vendure.service.ts
│   ├── sync.service.ts
│   └── settings.service.ts
├── dtos/
│   ├── save-settings.dto.ts
│   └── sync-request.dto.ts
├── constants/
│   └── sync.constants.ts
└── utils/
    └── mappers.ts
```

## Configuration

### Shopify Setup: Create a Custom App

1. **Log in to Shopify Partner Dashboard** → Select your development store
2. **Create App** → Choose "Create an app manually" → Name: `Vendure Sync`
3. **Admin API Access** → Under "Configuration":
   - Enable `Admin API` scopes:
     - `read_products` (fetch product data)
     - `read_variants` (fetch variant data)
     - `read_customers` (fetch customer data)
     - `read_orders` (fetch order data)
   - Optionally, add `write_products` for future stock sync (not yet implemented)
4. **Generate Access Token**:
   - Click "Install app" or "Reinstall"
   - Copy the **Admin API Access Token** (starts with `shpat_`)
   - Store securely (never commit to git!)

### Vendure Setup: Generate Admin Token

1. **Log in to Vendure Admin** → http://localhost:3000/admin
2. **Settings** → **API Keys** (or similar, depending on your Vendure version)
3. **Create API Key** with `SUPERADMIN` or appropriate role
4. Copy the token and store securely

### Environment Variables

Create a `.env` file (or use your CI/CD secret management):

```bash
# Shopify (per channel/tenant)
SHOPIFY_STORE_DEFAULT=my-store.myshopify.com
SHOPIFY_TOKEN_DEFAULT=shpat_1234567890abcdef

# Vendure
VENDURE_ADMIN_URL=http://localhost:3000
VENDURE_ADMIN_TOKEN=your_admin_api_token_here

# Optional: per-channel overrides
SHOPIFY_STORE_CLIENT_A=client-a.myshopify.com
SHOPIFY_TOKEN_CLIENT_A=shpat_xxxxx
```

## REST API Endpoints

### 1. Save Settings

**POST** `/shopify-sync/settings/save`

Save Shopify API credentials and Vendure configuration for a channel.

**Request:**

```json
{
  "channelId": "default",
  "shopifyStore": "my-store.myshopify.com",
  "shopifyAccessToken": "shpat_1234567890abcdef",
  "vendureAdminToken": "your_vendure_admin_token",
  "vendureAdminUrl": "http://localhost:3000",
  "vendureChannelId": "default"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings saved for channel: default"
}
```

### 2. Get Settings

**GET** `/shopify-sync/settings/:channelId`

Retrieve saved settings for a channel (tokens are never returned).

**Response:**

```json
{
  "channelId": "default",
  "shopifyStore": "my-store.myshopify.com",
  "vendureChannelId": "default",
  "vendureAdminUrl": "http://localhost:3000"
}
```

### 3. Sync Products

**POST** `/shopify-sync/products/sync`

Fetch all products from Shopify and create/update them in Vendure with variants.

**Request:**

```json
{
  "channelId": "default",
  "afterDate": "2024-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product sync completed",
  "stats": {
    "productsCreated": 15,
    "productsUpdated": 3,
    "variantsCreated": 42,
    "errors": []
  }
}
```

### 4. Sync Customers

**POST** `/shopify-sync/customers/sync`

Fetch all customers from Shopify and create/update them in Vendure with addresses.

**Request:**

```json
{
  "channelId": "default"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer sync completed",
  "stats": {
    "customersCreated": 50,
    "customersUpdated": 10,
    "errors": []
  }
}
```

### 5. Sync Orders

**POST** `/shopify-sync/orders/sync`

Fetch orders from Shopify (mapped for informational purposes; no DB creation yet).

**Request:**

```json
{
  "channelId": "default"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order sync completed",
  "stats": {
    "ordersProcessed": 100,
    "errors": []
  }
}
```

### 6. Sync All

**POST** `/shopify-sync/all/sync`

Run a complete sync: products → customers → orders (sequential).

**Request:**

```json
{
  "channelId": "default",
  "afterDate": "2024-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Full sync completed",
  "stats": {
    "productsCreated": 15,
    "productsUpdated": 3,
    "customersCreated": 50,
    "customersUpdated": 10,
    "ordersProcessed": 100,
    "totalErrors": 0,
    "errors": []
  }
}
```

### 7. List Channels

**GET** `/shopify-sync/channels`

List all channels with saved settings.

**Response:**

```json
{
  "channels": ["default", "client-a", "client-b"]
}
```

## Data Mapping

### Products

| Shopify Field | Vendure Field | Notes |
|---|---|---|
| `id` | `customFields.shopifyId` | Stored for idempotency |
| `title` | `translations[].name` | Language: 'en' |
| `handle` | `translations[].slug` | URL-safe slug |
| `descriptionHtml` | `translations[].description` | HTML stripped to plain text |
| `images[].originalSrc` | `assetIds` | Will be mapped to assets |
| `variants[*].title` | Variant name | Per variant |
| `variants[*].sku` | `sku` | Variant SKU |
| `variants[*].price` | `price` | In cents (multiplied by 100) |
| `variants[*].id` | `customFields.shopifyVariantId` | For idempotency |

### Customers

| Shopify Field | Vendure Field | Notes |
|---|---|---|
| `id` | `customFields.shopifyCustomerId` | For idempotency |
| `email` | `emailAddress` | Primary key for updates |
| `firstName` | `firstName` | Customer first name |
| `lastName` | `lastName` | Customer last name |
| `phone` | `phoneNumber` | Contact phone |
| `addresses[*].address1` | `addresses[].streetLine1` | First address used |
| `addresses[*].address2` | `addresses[].streetLine2` | Optional |
| `addresses[*].city` | `addresses[].city` | City name |
| `addresses[*].province` | `addresses[].province` | State/province |
| `addresses[*].zip` | `addresses[].postalCode` | Postal code |
| `addresses[*].country` | `addresses[].country` | Country name |

### Orders

**Currently informational only** (no creation in Vendure). Mapped for logging and future extension.

## Advanced Configuration

### Multi-Channel / Multi-Tenant Setup

Save settings for multiple channels:

```bash
# POST /shopify-sync/settings/save
{
  "channelId": "client-a",
  "shopifyStore": "client-a.myshopify.com",
  "shopifyAccessToken": "shpat_xxxxx",
  "vendureAdminToken": "token_xxxxx",
  "vendureChannelId": "channel_a"
}

# POST /shopify-sync/settings/save
{
  "channelId": "client-b",
  "shopifyStore": "client-b.myshopify.com",
  "shopifyAccessToken": "shpat_yyyyy",
  "vendureAdminToken": "token_yyyyy",
  "vendureChannelId": "channel_b"
}
```

Then sync each independently:

```bash
POST /shopify-sync/all/sync
{ "channelId": "client-a" }

POST /shopify-sync/all/sync
{ "channelId": "client-b" }
```

### Incremental Sync

Sync only products created after a specific date:

```bash
POST /shopify-sync/products/sync
{
  "channelId": "default",
  "afterDate": "2024-11-01T00:00:00Z"
}
```

The `afterDate` parameter is optional and only affects product queries.

### Custom Credentials Storage

The `SettingsService` uses in-memory storage by default. For production, extend it:

**Example: Redis Backend**

```typescript
// services/settings.service.ts
import { RedisService } from 'nestjs-redis';

@Injectable()
export class SettingsService {
  constructor(private redisService: RedisService) {}

  async saveSettings(channelId: string, settings: any): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.set(
      `shopify-sync:settings:${channelId}`,
      JSON.stringify(settings),
      'EX',
      86400 * 30, // 30 days
    );
  }

  async getSettings(channelId: string): Promise<any | null> {
    const redis = this.redisService.getClient();
    const data = await redis.get(`shopify-sync:settings:${channelId}`);
    return data ? JSON.parse(data) : null;
  }
}
```

## Future Enhancements

### 1. Stock Sync (Write-Back)

After products are synced, push inventory quantities from Vendure back to Shopify:

```typescript
// In sync.service.ts
async syncInventoryToShopify(channelId: string) {
  // Fetch Vendure product stock quantities
  // For each product, call Shopify mutation to update inventory
  // Mutation: inventorySetQuantities()
}
```

Requires `write_inventory` scope on Shopify.

### 2. Webhook Listeners

Replace manual triggers with real-time webhooks:

```typescript
// Shopify webhook: POST /shopify-sync/webhooks/products/create
@Post('webhooks/products/create')
async onShopifyProductCreated(@Body() event: any) {
  // Automatically sync the created product
}
```

### 3. Order Fulfillment Sync

Create orders in Vendure with proper payment/fulfillment state:

```typescript
// Vendure CreateOrderInput requires more complex logic
// Including customer association, line items, payments, etc.
async createFullOrder(vendureUrl: string, adminToken: string, orderInput: any) {
  // Complex order creation logic
}
```

### 4. Scheduled Syncs

Use NestJS `@Cron` decorator for automatic periodic syncs:

```typescript
@Cron('0 0 * * *') // Daily at midnight
async scheduledSyncAll() {
  const channels = this.settingsService.getAllChannelIds();
  for (const channelId of channels) {
    await this.syncService.syncAll(channelId);
  }
}
```

### 5. GraphQL Subscription Support

Monitor sync progress via GraphQL subscriptions (WebSocket):

```typescript
@Subscription(() => SyncProgressType)
@GqlOperation('OnSyncProgress')
syncProgress() {
  return pubSub.subscribe('SYNC_PROGRESS');
}
```

### 6. Audit Logging

Log all sync operations to a database for compliance/debugging:

```typescript
// Create a SyncLog entity (no schema changes required; can use Vendure's event bus)
// Log: sync start, products synced, errors, completion time
```

## Testing

### Unit Tests (Example)

```typescript
// sync.service.spec.ts
describe('SyncService', () => {
  let service: SyncService;
  let shopifyService: ShopifyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: ShopifyService, useValue: { fetchAllProducts: jest.fn() } },
        // ...
      ],
    }).compile();

    service = module.get(SyncService);
    shopifyService = module.get(ShopifyService);
  });

  it('should sync products', async () => {
    jest.spyOn(shopifyService, 'fetchAllProducts').mockResolvedValue([
      { id: 'gid://shopify/Product/1', title: 'Test Product', handle: 'test' },
    ]);

    const stats = await service.syncProducts('default');
    expect(stats.productsCreated).toBeGreaterThan(0);
  });
});
```

### Integration Tests (Example)

```bash
# 1. Save settings
curl -X POST http://localhost:3000/shopify-sync/settings/save \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "test",
    "shopifyStore": "test-store.myshopify.com",
    "shopifyAccessToken": "shpat_test",
    "vendureAdminToken": "token_test"
  }'

# 2. Sync products
curl -X POST http://localhost:3000/shopify-sync/products/sync \
  -H "Content-Type: application/json" \
  -d '{ "channelId": "test" }'

# 3. Check results
curl http://localhost:3000/shopify-sync/settings/test
```

## Troubleshooting

### "Cannot authenticate with Shopify"

- Check `shopifyStore` format: should be `my-store.myshopify.com`, not a full URL
- Verify `shopifyAccessToken` starts with `shpat_`
- Ensure the custom app is installed and token is active
- Check API scopes: `read_products`, `read_customers`, `read_orders`

### "Vendure GraphQL Error: Authentication failed"

- Verify `vendureAdminToken` is correct and not expired
- Ensure token has `SUPERADMIN` or appropriate role
- Check `vendureAdminUrl` is reachable: `http://localhost:3000/admin-api`

### "Product sync created duplicates"

- Idempotency uses `customFields.shopifyId`. If this field is missing, products are created as new.
- Verify the `shopifyId` custom field exists in your Vendure Product entity (added via `customFields` config, not schema changes).

### "Memory grows over time"

- If using in-memory `SettingsService`, credentials are never cleared. Extend with Redis or DB for production.
- Large syncs may need pagination tuning; adjust `SHOPIFY_PAGE_SIZE` constant.

## Performance Considerations

- **Pagination**: Shopify and Vendure both use cursor-based pagination. Page size set to 250 (Shopify max).
- **GraphQL Query Complexity**: Queries are optimized to avoid N+1 issues. Batch requests where possible.
- **Rate Limiting**: Shopify typically allows 2 API calls/second for custom apps. Retry logic handles rate limit errors.
- **Timeouts**: Set to 30s by default; adjust in constants if needed.

## Security Best Practices

1. **Never commit `.env` or credentials** — Always use environment variables or a secret manager
2. **Use HashiCorp Vault or AWS Secrets Manager** for production credential storage
3. **Rotate tokens regularly** — Invalidate old tokens, generate new ones
4. **Limit API scopes** — Only request necessary scopes (read_products, etc.; avoid write_* if not needed)
5. **Use HTTPS** — Ensure all API communication is encrypted
6. **Audit logging** — Log all sync operations for compliance
7. **Access control** — Protect sync endpoints behind authentication (add `@UseGuards()` as needed)

## Support & Contributing

For issues, improvements, or feature requests:

1. Check existing issues and discussions
2. Provide detailed error logs and steps to reproduce
3. Include Shopify/Vendure API versions and NestJS version
4. Suggest enhancements with use cases

## License

MIT (or your project's license)

## Changelog

### v1.0.0 (Initial Release)

- ✅ Product sync with variants
- ✅ Customer sync with addresses
- ✅ Order mapping (informational)
- ✅ Multi-channel support
- ✅ GraphQL-only integration
- ✅ Settings management
- ✅ REST API endpoints
- 🔄 Order creation (stub; future enhancement)
- 🔄 Stock sync to Shopify (future)
- 🔄 Webhook listeners (future)
- 🔄 Scheduled syncs (future)

---

**Happy Syncing! 🚀**
