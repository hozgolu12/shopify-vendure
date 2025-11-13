/**
 * Mapper utilities to transform Shopify data to Vendure format
 *
 * These functions handle the domain-specific mapping between Shopify's
 * GraphQL schema and Vendure's Admin API input formats.
 */

/**
 * Map a Shopify product to Vendure CreateProductInput format
 *
 * @param shopifyProduct - Product object from Shopify GraphQL API
 * @returns Vendure CreateProductInput-compatible object
 */
export function mapShopifyProductToVendure(shopifyProduct: any) {
  // Sanitize slug from handle
  const slug = (shopifyProduct.handle || shopifyProduct.title || '').toLowerCase().replace(/\s+/g, '-');

  // Extract images
  const images =
    shopifyProduct.images?.edges?.map((edge: any) => ({
      altText: edge.node.altText || shopifyProduct.title,
      sourceUrl: edge.node.originalSrc,
    })) || [];

  // Map to Vendure format
  const vendureProduct = {
    id: shopifyProduct.id, // Will be overridden by Vendure, but useful for debugging
    translations: [
      {
        languageCode: 'en',
        name: shopifyProduct.title,
        description: shopifyProduct.descriptionHtml
          ? stripHtml(shopifyProduct.descriptionHtml)
          : shopifyProduct.title,
        slug,
      },
    ],
    customFields: {
      shopifyId: shopifyProduct.id,
      shopifyHandle: shopifyProduct.handle,
    },
    assetIds: images.map((img: any) => img.sourceUrl),
    facetValueIds: [],
  };

  return vendureProduct;
}

/**
 * Map a Shopify customer to Vendure CreateCustomerInput format
 *
 * @param shopifyCustomer - Customer object from Shopify GraphQL API
 * @returns Vendure CreateCustomerInput-compatible object
 */
export function mapShopifyCustomerToVendure(shopifyCustomer: any) {
  // Map addresses
  const addresses =
    shopifyCustomer.addresses?.edges?.map((edge: any) => {
      const addr = edge.node;
      return {
        fullName: [addr.firstName, addr.lastName].filter(Boolean).join(' '),
        company: '',
        streetLine1: addr.address1,
        streetLine2: addr.address2 || '',
        city: addr.city,
        province: addr.province,
        postalCode: addr.zip,
        country: addr.country,
        defaultShippingAddress: addr.isDefault,
        defaultBillingAddress: addr.isDefault,
      };
    }) || [];

  const vendureCustomer = {
    id: shopifyCustomer.id, // Will be overridden
    firstName: shopifyCustomer.firstName || '',
    lastName: shopifyCustomer.lastName || '',
    emailAddress: shopifyCustomer.email,
    phoneNumber: shopifyCustomer.phone || '',
    customFields: {
      shopifyCustomerId: shopifyCustomer.id,
      shopifyEmail: shopifyCustomer.email,
    },
    addresses: addresses.length > 0 ? [addresses[0]] : [], // Use first address for now
  };

  return vendureCustomer;
}

/**
 * Map a Shopify order to an informational format
 * (Note: Full order creation in Vendure is complex and requires payment/fulfillment handling)
 *
 * @param shopifyOrder - Order object from Shopify GraphQL API
 * @returns Informational order object for logging/reporting
 */
export function mapShopifyOrderToVendure(shopifyOrder: any) {
  const orderInfo = {
    shopifyId: shopifyOrder.id,
    shopifyName: shopifyOrder.name,
    email: shopifyOrder.email || shopifyOrder.customer?.email,
    totalPrice: parseFloat(shopifyOrder.totalPrice),
    subtotalPrice: shopifyOrder.subtotalPrice ? parseFloat(shopifyOrder.subtotalPrice) : undefined,
    totalTax: shopifyOrder.totalTax ? parseFloat(shopifyOrder.totalTax) : undefined,
    createdAt: shopifyOrder.createdAt,
    processedAt: shopifyOrder.processedAt,
    items: (shopifyOrder.lineItems?.edges || []).map((le: any) => {
      const node = le.node;
      return {
        title: node.title,
        quantity: node.quantity,
        originalUnitPrice: parseFloat(node.originalUnitPrice),
        variantId: node.variant?.id,
        sku: node.variant?.sku,
      };
    }),
  };

  return orderInfo;
}

/**
 * Utility: Strip HTML tags from a string
 * Used to clean Shopify description HTML for Vendure text fields
 *
 * @param html - HTML string
 * @returns Plain text
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Utility: Generate a URL-safe slug from a string
 *
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Utility: Determine Vendure channel from Shopify sales channel
 * Can be extended to support custom mappings per tenant
 *
 * @param shopifySalesChannel - Shopify sales channel name
 * @param defaultChannel - Fallback channel ID
 * @returns Vendure channel ID
 */
export function mapSalesChannelToVendureChannel(shopifySalesChannel: string, defaultChannel = 'default'): string {
  // Example: map Shopify sales channels to Vendure channels
  const channelMap: Record<string, string> = {
    'Online Store': 'default',
    'Point of Sale': 'pos',
    'B2B': 'b2b',
  };

  return channelMap[shopifySalesChannel] || defaultChannel;
}
