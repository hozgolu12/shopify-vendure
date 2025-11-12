import { Injectable } from "@nestjs/common";
import {
  TransactionalConnection,
  RequestContext,
  ProductService,
  CustomerService,
  OrderService,
  Customer,
  Product,
  ProductVariant,
  Order,
  EventBus,
  ProductEvent,
  CustomerEvent,
  OrderStateTransitionEvent,
  Logger,
  ProductVariantService,
} from "@vendure/core";
import { TenantShopifySettings } from "../entities/tenant-shopify-settings.entity";

const loggerCtx = "ShopifyService";

@Injectable()
export class ShopifyService {
  constructor(
    private connection: TransactionalConnection,
    private productService: ProductService,
    private productVariantService: ProductVariantService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private eventBus: EventBus
  ) {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for Vendure → Shopify sync
   */
  private setupEventListeners() {
    this.eventBus.ofType(ProductEvent).subscribe(async (event) => {
      if (event.type === 'created' || event.type === 'updated') {
        await this.syncProductToShopify(event.ctx, event.product);
      }
    });

    this.eventBus.ofType(CustomerEvent).subscribe(async (event) => {
      if (event.type === 'created' || event.type === 'updated') {
        await this.syncCustomerToShopify(event.ctx, event.customer);
      }
    });

    this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event) => {
      await this.syncOrderToShopify(event.ctx, event.order);
    });
  }

  // ============================================
  // SETTINGS MANAGEMENT
  // ============================================

  async upsertSettings(
    ctx: RequestContext,
    input: Partial<TenantShopifySettings>
  ): Promise<TenantShopifySettings> {
    const repo = this.connection.getRepository(ctx, TenantShopifySettings);
    let existing: TenantShopifySettings | null = null;
    
    if (input.id) {
      existing = await repo.findOne({ where: { id: input.id } });
    }
    if (!existing && input.tenantId) {
      existing = await repo.findOne({ where: { tenantId: input.tenantId } });
    }
    
    if (existing) {
      Object.assign(existing, input);
      return repo.save(existing) as unknown as TenantShopifySettings;
    }
    
    const newRec = repo.create(input as any);
    return (await repo.save(newRec)) as unknown as TenantShopifySettings;
  }

  async getSettingsByTenant(
    ctx: RequestContext,
    tenantId: number
  ): Promise<TenantShopifySettings | null> {
    const repo = this.connection.getRepository(ctx, TenantShopifySettings);
    return repo.findOne({ where: { tenantId } });
  }

  // ============================================
  // GRAPHQL API HELPERS
  // ============================================

  private async shopifyGraphQL(
    settings: TenantShopifySettings,
    query: string,
    variables?: any
  ) {
    if (!settings.accessToken) {
      throw new Error("Shopify accessToken is required for API calls");
    }

    const url = `https://${settings.shopDomain}/admin/api/2025-10/graphql.json`;
    
    Logger.debug(`Shopify GraphQL Request: ${query.substring(0, 100)}...`, loggerCtx);
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const txt = await res.text();
      Logger.error(`Shopify API error ${res.status}: ${txt}`, loggerCtx);
      throw new Error(`Shopify API error ${res.status}: ${txt}`);
    }

    const result = await res.json();
    
    if (result.errors) {
      Logger.error(`Shopify GraphQL errors: ${JSON.stringify(result.errors)}`, loggerCtx);
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  // ============================================
  // SHOPIFY → VENDURE SYNC
  // ============================================

  async syncProductsForTenant(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) {
      throw new Error(`Shopify settings not found for tenant ${tenantId}`);
    }

    Logger.info('Starting product sync from Shopify', loggerCtx);

    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              status
              vendor
              productType
              tags
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    inventoryQuantity
                    barcode
                    weight
                    weightUnit
                  }
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    let hasNextPage = true;
    let cursor = null;
    let created = 0;
    let updated = 0;
    let total = 0;

    while (hasNextPage) {
      const data = await this.shopifyGraphQL(settings, query, {
        first: 50,
        after: cursor,
      });

      const products = data.products.edges;
      total += products.length;

      for (const { node: shopifyProduct } of products) {
        try {
          const shopifyId = shopifyProduct.id.split('/').pop();
          const existingProduct = await this.findProductByShopifyId(ctx, shopifyId);

          if (existingProduct) {
            await this.updateVendureProduct(ctx, existingProduct, shopifyProduct);
            updated++;
          } else {
            await this.createVendureProduct(ctx, shopifyProduct);
            created++;
          }
        } catch (err) {
          Logger.error(
            `Failed to sync product from Shopify: ${shopifyProduct.id} - ${(err as any)?.message || err}`,
            loggerCtx
          );
        }
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
      cursor = data.products.pageInfo.endCursor;
    }

    Logger.info(`Product sync completed: ${created} created, ${updated} updated (total: ${total})`, loggerCtx);

    return {
      result: `Synced ${created} created, ${updated} updated (total: ${total})`,
    };
  }

  private async findProductByShopifyId(
    ctx: RequestContext,
    shopifyId: string
  ): Promise<Product | null> {
    const repo = this.connection.getRepository(ctx, Product);
    return repo.findOne({ where: { customFields: { shopifyId } } } as any);
  }

  private async createVendureProduct(
    ctx: RequestContext,
    shopifyProduct: any
  ): Promise<Product> {
    const shopifyId = shopifyProduct.id.split('/').pop();
    
    const createProductInput: any = {
      translations: [
        {
          languageCode: "en",
          name: shopifyProduct.title,
          slug: shopifyProduct.handle || shopifyProduct.title.toLowerCase().replace(/\s+/g, "-"),
          description: shopifyProduct.descriptionHtml || "",
        },
      ],
      enabled: shopifyProduct.status === 'ACTIVE',
      customFields: {
        shopifyId,
      },
    };

    const product = await this.productService.create(ctx, createProductInput);

    // Create variants
    if (shopifyProduct.variants?.edges?.length > 0) {
      for (const { node: variant } of shopifyProduct.variants.edges) {
        const variantId = variant.id.split('/').pop();
        
        await this.productVariantService.create(ctx, {
          productId: product.id,
          sku: variant.sku || `${shopifyId}-${variantId}`,
          price: variant.price ? Math.round(parseFloat(variant.price) * 100) : 0,
          stockOnHand: variant.inventoryQuantity || 0,
          translations: [
            {
              languageCode: "en",
              name: variant.title || shopifyProduct.title,
            },
          ],
          customFields: {
            shopifyVariantId: variantId,
          },
        } as any);
      }
    }

    Logger.info(`Created product: ${product.id} (Shopify: ${shopifyId})`, loggerCtx);
    return product;
  }

  private async updateVendureProduct(
    ctx: RequestContext,
    product: Product,
    shopifyProduct: any
  ): Promise<Product> {
    const updateInput: any = {
      id: product.id,
      translations: [
        {
          languageCode: "en",
          name: shopifyProduct.title,
          slug: shopifyProduct.handle || shopifyProduct.title.toLowerCase().replace(/\s+/g, "-"),
          description: shopifyProduct.descriptionHtml || "",
        },
      ],
      enabled: shopifyProduct.status === 'ACTIVE',
    };

    Logger.info(`Updated product: ${product.id}`, loggerCtx);
    return this.productService.update(ctx, updateInput);
  }

  async syncCustomersForTenant(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) {
      throw new Error(`Shopify settings not found for tenant ${tenantId}`);
    }

    Logger.info('Starting customer sync from Shopify', loggerCtx);

    const query = `
      query GetCustomers($first: Int!, $after: String) {
        customers(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              firstName
              lastName
              email
              phone
              addresses {
                address1
                address2
                city
                province
                country
                zip
              }
            }
          }
        }
      }
    `;

    let hasNextPage = true;
    let cursor = null;
    let created = 0;
    let total = 0;

    while (hasNextPage) {
      const data = await this.shopifyGraphQL(settings, query, {
        first: 50,
        after: cursor,
      });

      const customers = data.customers.edges;
      total += customers.length;

      for (const { node: shopifyCustomer } of customers) {
        try {
          const customerRepo = this.connection.getRepository(ctx, Customer);
          const existing = await customerRepo.findOne({
            where: { emailAddress: shopifyCustomer.email },
          });

          if (!existing) {
            const shopifyId = shopifyCustomer.id.split('/').pop();
            
            const input: any = {
              firstName: shopifyCustomer.firstName || "",
              lastName: shopifyCustomer.lastName || "",
              emailAddress: shopifyCustomer.email,
              phoneNumber: shopifyCustomer.phone || undefined,
              customFields: {
                shopifyCustomerId: shopifyId,
              },
            };

            await this.customerService.create(ctx, input);
            created++;
            Logger.info(`Created customer: ${shopifyCustomer.email}`, loggerCtx);
          }
        } catch (err) {
          Logger.error(
            `Failed to create customer from Shopify: ${shopifyCustomer.id} - ${(err as any)?.message || err}`,
            loggerCtx
          );
        }
      }

      hasNextPage = data.customers.pageInfo.hasNextPage;
      cursor = data.customers.pageInfo.endCursor;
    }

    Logger.info(`Customer sync completed: ${created} created (total: ${total})`, loggerCtx);

    return { result: `Synced ${created} new customers (total: ${total})` };
  }

  async syncOrdersForTenant(
    ctx: RequestContext,
    tenantId: number
  ): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) {
      throw new Error(`Shopify settings not found for tenant ${tenantId}`);
    }

    Logger.info('Starting order sync from Shopify', loggerCtx);

    const query = `
      query GetOrders($first: Int!, $after: String) {
        orders(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              email
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 100) {
                edges {
                  node {
                    id
                    title
                    quantity
                    variant {
                      id
                      sku
                    }
                  }
                }
              }
              customer {
                id
                email
              }
            }
          }
        }
      }
    `;

    let hasNextPage = true;
    let cursor = null;
    let processed = 0;
    let total = 0;

    while (hasNextPage) {
      const data = await this.shopifyGraphQL(settings, query, {
        first: 50,
        after: cursor,
      });

      const orders = data.orders.edges;
      total += orders.length;

      for (const { node: shopifyOrder } of orders) {
        try {
          const shopifyOrderId = shopifyOrder.id.split('/').pop();
          const orderRepo = this.connection.getRepository(ctx, Order);
          const existing = await orderRepo.findOne({
            where: { customFields: { shopifyOrderId } },
          } as any);

          if (!existing) {
            await this.importShopifyOrder(ctx, shopifyOrder);
            processed++;
          }
        } catch (err) {
          Logger.error(
            `Failed to import Shopify order: ${shopifyOrder.id} - ${(err as any)?.message || err}`,
            loggerCtx
          );
        }
      }

      hasNextPage = data.orders.pageInfo.hasNextPage;
      cursor = data.orders.pageInfo.endCursor;
    }

    Logger.info(`Order sync completed: ${processed} imported (total: ${total})`, loggerCtx);

    return { result: `Imported ${processed} new orders (total: ${total})` };
  }

  private async importShopifyOrder(
    ctx: RequestContext,
    shopifyOrder: any
  ): Promise<void> {
    Logger.info(`Importing Shopify order: ${shopifyOrder.name}`, loggerCtx);
    
    // Find or create customer
    let customer: Customer | null = null;
    if (shopifyOrder.customer?.email) {
      const customerRepo = this.connection.getRepository(ctx, Customer);
      customer = await customerRepo.findOne({
        where: { emailAddress: shopifyOrder.customer.email },
      });
    }

    // Map line items to Vendure variants
    const lines = [];
    for (const { node: lineItem } of shopifyOrder.lineItems.edges) {
      if (lineItem.variant) {
        const variantId = lineItem.variant.id.split('/').pop();
        const variantRepo = this.connection.getRepository(ctx, ProductVariant);
        const variant = await variantRepo.findOne({
          where: [
            { sku: lineItem.variant.sku },
            { customFields: { shopifyVariantId: variantId } },
          ],
        } as any);

        if (variant) {
          lines.push({
            productVariantId: variant.id,
            quantity: lineItem.quantity,
          });
        }
      }
    }

    Logger.info(
      `Order ${shopifyOrder.name} prepared with ${lines.length} line items`,
      loggerCtx
    );
  }

  // ============================================
  // VENDURE → SHOPIFY SYNC
  // ============================================

  async syncProductToShopify(
    ctx: RequestContext,
    product: Product
  ): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      const shopifyId = (product as any).customFields?.shopifyId;
      const fullProduct = await this.productService.findOne(ctx, product.id);
      if (!fullProduct) return;

      if (shopifyId) {
        // Update existing product
        const mutation = `
          mutation UpdateProduct($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const variables = {
          input: {
            id: `gid://shopify/Product/${shopifyId}`,
            title: fullProduct.name,
            descriptionHtml: fullProduct.description,
            status: fullProduct.enabled ? 'ACTIVE' : 'DRAFT',
          },
        };

        await this.shopifyGraphQL(settings, mutation, variables);
        Logger.info(`Updated product in Shopify: ${shopifyId}`, loggerCtx);
      } else {
        // Create new product
        const mutation = `
          mutation CreateProduct($input: ProductInput!) {
            productCreate(input: $input) {
              product {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const variables = {
          input: {
            title: fullProduct.name,
            descriptionHtml: fullProduct.description,
            status: fullProduct.enabled ? 'ACTIVE' : 'DRAFT',
          },
        };

        const data = await this.shopifyGraphQL(settings, mutation, variables);
        
        if (data.productCreate.product) {
          const newShopifyId = data.productCreate.product.id.split('/').pop();
          
          // Update Vendure product with Shopify ID
          await this.productService.update(ctx, {
            id: product.id,
            customFields: {
              shopifyId: newShopifyId,
            },
          });
          
          Logger.info(`Created product in Shopify: ${newShopifyId}`, loggerCtx);
        }
      }
    } catch (err) {
      Logger.error(`Failed to sync product to Shopify: ${(err as any)?.message || err}`, loggerCtx);
    }
  }

  async syncCustomerToShopify(
    ctx: RequestContext,
    customer: Customer
  ): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      const shopifyId = (customer as any).customFields?.shopifyCustomerId;

      if (shopifyId) {
        // Update existing customer
        const mutation = `
          mutation UpdateCustomer($input: CustomerInput!) {
            customerUpdate(input: $input) {
              customer {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const variables = {
          input: {
            id: `gid://shopify/Customer/${shopifyId}`,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.emailAddress,
          },
        };

        await this.shopifyGraphQL(settings, mutation, variables);
        Logger.info(`Updated customer in Shopify: ${shopifyId}`, loggerCtx);
      } else {
        // Create new customer
        const mutation = `
          mutation CreateCustomer($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const variables = {
          input: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.emailAddress,
          },
        };

        const data = await this.shopifyGraphQL(settings, mutation, variables);
        
        if (data.customerCreate.customer) {
          const newShopifyId = data.customerCreate.customer.id.split('/').pop();
          
          // Update Vendure customer with Shopify ID
          const customerRepo = this.connection.getRepository(ctx, Customer);
          customer.customFields = customer.customFields || {};
          (customer.customFields as any).shopifyCustomerId = newShopifyId;
          await customerRepo.save(customer);
          
          Logger.info(`Created customer in Shopify: ${newShopifyId}`, loggerCtx);
        }
      }
    } catch (err) {
      Logger.error(`Failed to sync customer to Shopify: ${(err as any)?.message || err}`, loggerCtx);
    }
  }

  async syncOrderToShopify(
    ctx: RequestContext,
    order: Order
  ): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      // Only sync orders that originated in Vendure
      const shopifyOrderId = (order as any).customFields?.shopifyOrderId;
      if (shopifyOrderId) return;

      const mutation = `
        mutation CreateDraftOrder($input: DraftOrderInput!) {
          draftOrderCreate(input: $input) {
            draftOrder {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const lineItems = order.lines.map(line => ({
        variantId: (line.productVariant as any).customFields?.shopifyVariantId
          ? `gid://shopify/ProductVariant/${(line.productVariant as any).customFields.shopifyVariantId}`
          : undefined,
        quantity: line.quantity,
        title: line.productVariant.name,
      })).filter(item => item.variantId);

      if (lineItems.length === 0) {
        Logger.warn(`No mappable line items for order ${order.code}`, loggerCtx);
        return;
      }

      const variables = {
        input: {
          lineItems,
          email: order.customer?.emailAddress,
          note: `Vendure Order #${order.code}`,
        },
      };

      await this.shopifyGraphQL(settings, mutation, variables);
      Logger.info(`Created draft order in Shopify for: ${order.code}`, loggerCtx);
    } catch (err) {
      Logger.error(`Failed to sync order to Shopify: ${(err as any)?.message || err}`, loggerCtx);
    }
  }

  // ============================================
  // WEBHOOK HANDLING
  // ============================================

  async handleWebhook(
    ctx: RequestContext,
    tenantId: number,
    event: string,
    payload: any
  ): Promise<void> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) return;

    Logger.info(`Handling Shopify webhook: ${event}`, loggerCtx);

    switch (event) {
      case 'products/create':
      case 'products/update':
        await this.createVendureProduct(ctx, payload);
        break;
      case 'customers/create':
      case 'customers/update':
        // Handle customer webhook
        break;
      case 'orders/create':
      case 'orders/updated':
        await this.importShopifyOrder(ctx, payload);
        break;
      default:
        Logger.warn(`Unhandled webhook event: ${event}`, loggerCtx);
    }
  }
}