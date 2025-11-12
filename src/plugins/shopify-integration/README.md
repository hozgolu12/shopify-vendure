Shopify Integration plugin (scaffold)

What this scaffold provides:

- A Vendure plugin skeleton at `src/plugins/shopify-integration`.
- Entity to store tenant-level Shopify credentials: `TenantShopifySettings`.
- GraphQL admin/shop API to upsert and fetch settings and trigger a product sync.
- A service (`ShopifyService`) with stubbed methods for sync and webhook handling.

Next steps / recommended improvements:

1. Implement real Shopify API calls (use fetch or axios). Securely store API secrets (encrypt at rest).
2. Add webhook endpoint (e.g., Nest controller) to receive Shopify webhooks and map events to Vendure mutations.
3. Add admin UI pages in `ui/` to manage credentials per tenant/workspace.
4. Add migrations if you need to rename or alter the entity columns.
5. Add tests for service and resolver.
