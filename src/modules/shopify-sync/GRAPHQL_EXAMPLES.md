/**
 * GraphQL Query and Mutation Examples
 *
 * This file documents the exact GraphQL queries and mutations used by the module.
 * Useful for:
 * - Understanding the data flow
 * - Debugging API calls
 * - Testing with GraphQL clients (GraphiQL, Postman, etc.)
 * - Extending the module with additional fields
 */

// ============================================================================
// SHOPIFY ADMIN GRAPHQL API QUERIES
// ============================================================================

/**
 * Fetch Products from Shopify
 *
 * Endpoint: https://my-store.myshopify.com/admin/api/2024-07/graphql.json
 * Headers: { "X-Shopify-Access-Token": "shpat_xxx", "Content-Type": "application/json" }
 */
export const SHOPIFY_FETCH_PRODUCTS_QUERY = `
  query ($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          handle
          descriptionHtml
          createdAt
          images(first: 50) {
            edges {
              node {
                id
                originalSrc
                altText
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                sku
                price
                weight
                weightUnit
                barcode
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Variables for Products Query (example)
 */
export const SHOPIFY_PRODUCTS_VARIABLES = {
  first: 250,
  after: null,
  query: null, // optional: e.g. 'created_at:>="2024-01-01T00:00:00Z"'
};

/**
 * Fetch Customers from Shopify
 */
export const SHOPIFY_FETCH_CUSTOMERS_QUERY = `
  query ($first: Int!, $after: String) {
    customers(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          email
          firstName
          lastName
          phone
          createdAt
          addresses(first: 10) {
            edges {
              node {
                id
                firstName
                lastName
                address1
                address2
                city
                province
                country
                zip
                isDefault
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch Orders from Shopify
 */
export const SHOPIFY_FETCH_ORDERS_QUERY = `
  query ($first: Int!, $after: String) {
    orders(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          email
          totalPrice
          subtotalPrice
          totalTax
          createdAt
          processedAt
          customer {
            id
            email
            firstName
            lastName
          }
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                originalUnitPrice
                variant {
                  id
                  sku
                  product {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ============================================================================
// VENDURE ADMIN GRAPHQL API MUTATIONS
// ============================================================================

/**
 * Create Product in Vendure
 *
 * Endpoint: http://localhost:3000/admin-api
 * Headers: { "Authorization": "Bearer token_xxx", "Content-Type": "application/json" }
 */
export const VENDURE_CREATE_PRODUCT_MUTATION = `
  mutation ($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      description
    }
  }
`;

/**
 * Variables for Create Product (example)
 */
export const VENDURE_CREATE_PRODUCT_VARIABLES = {
  input: {
    translations: [
      {
        languageCode: 'en',
        name: 'Test Product',
        description: 'A test product from Shopify',
        slug: 'test-product',
      },
    ],
    customFields: {
      shopifyId: 'gid://shopify/Product/123',
      shopifyHandle: 'test-product',
    },
    assetIds: [],
    facetValueIds: [],
  },
};

/**
 * Update Product in Vendure
 */
export const VENDURE_UPDATE_PRODUCT_MUTATION = `
  mutation ($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      slug
    }
  }
`;

/**
 * Create Product Variant in Vendure
 */
export const VENDURE_CREATE_VARIANT_MUTATION = `
  mutation ($input: CreateProductVariantInput!) {
    createProductVariant(input: $input) {
      id
      sku
      name
      price
    }
  }
`;

/**
 * Variables for Create Variant (example)
 */
export const VENDURE_CREATE_VARIANT_VARIABLES = {
  input: {
    productId: 'product_id_from_vendure',
    translations: [
      {
        languageCode: 'en',
        name: 'Red - Size M',
        description: '',
      },
    ],
    sku: 'PROD-RED-M',
    price: 2999, // in cents
    trackInventory: true,
    customFields: {
      shopifyVariantId: 'gid://shopify/ProductVariant/456',
    },
  },
};

/**
 * Create Customer in Vendure
 */
export const VENDURE_CREATE_CUSTOMER_MUTATION = `
  mutation ($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      firstName
      lastName
      emailAddress
    }
  }
`;

/**
 * Variables for Create Customer (example)
 */
export const VENDURE_CREATE_CUSTOMER_VARIABLES = {
  input: {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    phoneNumber: '+1234567890',
    customFields: {
      shopifyCustomerId: 'gid://shopify/Customer/789',
      shopifyEmail: 'john@example.com',
    },
    addresses: [
      {
        fullName: 'John Doe',
        streetLine1: '123 Main St',
        streetLine2: '',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'United States',
        defaultShippingAddress: true,
        defaultBillingAddress: true,
      },
    ],
  },
};

/**
 * Update Customer in Vendure
 */
export const VENDURE_UPDATE_CUSTOMER_MUTATION = `
  mutation ($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

/**
 * Add Products to Channel in Vendure
 */
export const VENDURE_ADD_PRODUCTS_TO_CHANNEL_MUTATION = `
  mutation ($input: AddProductsToChannelInput!) {
    addProductsToChannel(input: $input) {
      success
    }
  }
`;

/**
 * Variables for Add Products to Channel (example)
 */
export const VENDURE_ADD_PRODUCTS_TO_CHANNEL_VARIABLES = {
  input: {
    productIds: ['product_id_1', 'product_id_2'],
    channelId: 'default',
  },
};

/**
 * Find Product by Custom Field (Shopify ID)
 */
export const VENDURE_FIND_PRODUCT_BY_SHOPIFY_ID_QUERY = `
  query ($customFields: JSON) {
    products(filter: { customFields: $customFields }) {
      items {
        id
        name
        slug
      }
    }
  }
`;

/**
 * Find Customer by Email
 */
export const VENDURE_FIND_CUSTOMER_BY_EMAIL_QUERY = `
  query ($emailAddress: String!) {
    customers(filter: { emailAddress: { contains: $emailAddress } }) {
      items {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

/**
 * Find Product Variant by SKU
 */
export const VENDURE_FIND_VARIANT_BY_SKU_QUERY = `
  query ($sku: String!) {
    productVariants(filter: { sku: $sku }) {
      items {
        id
        sku
        product {
          id
        }
      }
    }
  }
`;

// ============================================================================
// TESTING WITH CURL / API CLIENT
// ============================================================================

/**
 * Example: Test Shopify Products Fetch with curl
 *
 * $ curl -X POST https://my-store.myshopify.com/admin/api/2024-07/graphql.json \
 *   -H "X-Shopify-Access-Token: shpat_xxx" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "query": "query { products(first: 10) { edges { node { id title } } } }"
 *   }'
 */

/**
 * Example: Test Vendure Create Product with curl
 *
 * $ curl -X POST http://localhost:3000/admin-api \
 *   -H "Authorization: Bearer token_xxx" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "query": "mutation { createProduct(input: { translations: [] }) { id } }"
 *   }'
 */

// ============================================================================
// POSTMAN COLLECTION EXAMPLE
// ============================================================================

/**
 * Postman Collection JSON (simplified example)
 *
 * {
 *   "info": { "name": "Shopify-Vendure Sync" },
 *   "item": [
 *     {
 *       "name": "Shopify - Fetch Products",
 *       "request": {
 *         "method": "POST",
 *         "url": "https://my-store.myshopify.com/admin/api/2024-07/graphql.json",
 *         "header": [
 *           { "key": "X-Shopify-Access-Token", "value": "shpat_xxx" },
 *           { "key": "Content-Type", "value": "application/json" }
 *         ],
 *         "body": {
 *           "mode": "graphql",
 *           "graphql": {
 *             "query": "query { products(first: 250) { edges { node { id title } } } }"
 *           }
 *         }
 *       }
 *     },
 *     {
 *       "name": "Vendure - Create Product",
 *       "request": {
 *         "method": "POST",
 *         "url": "http://localhost:3000/admin-api",
 *         "header": [
 *           { "key": "Authorization", "value": "Bearer token_xxx" },
 *           { "key": "Content-Type", "value": "application/json" }
 *         ],
 *         "body": {
 *           "mode": "graphql",
 *           "graphql": {
 *             "query": "mutation { createProduct(input: {}) { id } }"
 *           }
 *         }
 *       }
 *     }
 *   ]
 * }
 */

// ============================================================================
// EXTENDING THE MODULE
// ============================================================================

/**
 * To add new fields to the sync:
 *
 * 1. Update the Shopify query to include new fields (e.g., product tags)
 * 2. Update the mapper function to transform the data
 * 3. Update the Vendure mutation to store the new fields (via customFields)
 * 4. Test end-to-end with a small dataset
 *
 * Example: Add product tags
 *
 * Shopify query:
 *   {
 *     products {
 *       edges {
 *         node {
 *           id
 *           title
 *           tags  // <-- add this
 *         }
 *       }
 *     }
 *   }
 *
 * Mapper:
 *   export function mapShopifyProductToVendure(shopifyProduct: any) {
 *     return {
 *       ...
 *       customFields: {
 *         shopifyId: shopifyProduct.id,
 *         shopifyTags: shopifyProduct.tags.join(','),  // <-- add this
 *       }
 *     };
 *   }
 *
 * Make sure the Vendure Product entity has a `shopifyTags` custom field defined.
 */
