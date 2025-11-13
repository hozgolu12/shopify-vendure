/**
 * Constants for the Shopify-Vendure Sync Module
 */

/**
 * Shopify Admin GraphQL API version to use.
 * Update this to use a newer API version if needed.
 * Ref: https://shopify.dev/api/admin-graphql
 */
export const SHOPIFY_API_VERSION = '2024-07';

/**
 * Vendure Admin GraphQL endpoint path
 */
export const VENDURE_ADMIN_API_PATH = '/admin-api';

/**
 * In-memory settings store key prefix.
 * In production, use Redis, a database, or HashiCorp Vault.
 */
export const SETTINGS_STORE_PREFIX = 'shopify-sync:settings:';

/**
 * Pagination limit for Shopify GraphQL queries.
 * Max allowed by Shopify is typically 250.
 */
export const SHOPIFY_PAGE_SIZE = 250;

/**
 * Vendure CreateProductInput fields we support mapping.
 * Can be extended to include more fields like taxes, customFields, etc.
 */
export const VENDURE_PRODUCT_FIELDS = [
  'name',
  'description',
  'slug',
  'customFields',
  'translations',
  'featuredAssetId',
];

/**
 * Vendure CreateCustomerInput fields.
 */
export const VENDURE_CUSTOMER_FIELDS = [
  'firstName',
  'lastName',
  'emailAddress',
  'phone',
  'customFields',
  'addresses',
];

/**
 * GraphQL query/mutation complexity limits (prevent DoS via expensive queries).
 * Adjust based on your Shopify/Vendure instance limits.
 */
export const GQL_QUERY_TIMEOUT_MS = 30000;
export const GQL_MAX_RETRIES = 3;
