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
} from "@vendure/core";
import { TenantShopifySettings } from "../entities/tenant-shopify-settings.entity";

@Injectable()
export class ShopifyService {
  constructor(
    private connection: TransactionalConnection,
    private productService: ProductService,
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
    // Listen for product changes in Vendure
    this.eventBus.ofType(ProductEvent).subscribe(async (event) => {
      if (event.type === 'created' || event.type === 'updated') {
        await this.syncProductToShopify(event.ctx, event.product);
      }
    });

    // Listen for customer changes
    this.eventBus.ofType(CustomerEvent).subscribe(async (event) => {
      if (event.type === 'created' || event.type === 'updated') {
        await this.syncCustomerToShopify(event.ctx, event.customer);
      }
    });

    // Listen for order state changes
    this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event) => {
      await this.syncOrderToShopify(event.ctx, event.order);
    });
  }

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

  private async fetchFromShopify(settings: TenantShopifySettings, path: string) {
    if (!settings.accessToken) {
      throw new Error("Shopify accessToken is required for API calls");
    }
    const url = `https://${settings.shopDomain}/admin/api/2024-07/${path}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Shopify API error ${res.status}: ${txt}`);
    }
    return res.json();
  }

  private async postToShopify(settings: TenantShopifySettings, path: string, body: any) {
    if (!settings.accessToken) {
      throw new Error("Shopify accessToken is required for API calls");
    }
    const url = `https://${settings.shopDomain}/admin/api/2024-07/${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Shopify API error ${res.status}: ${txt}`);
    }
    return res.json();
  }

  private async putToShopify(settings: TenantShopifySettings, path: string, body: any) {
    if (!settings.accessToken) {
      throw new Error("Shopify accessToken is required for API calls");
    }
    const url = `https://${settings.shopDomain}/admin/api/2024-07/${path}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Shopify API error ${res.status}: ${txt}`);
    }
    return res.json();
  }

  // ============================================
  // SHOPIFY → VENDURE SYNC (Existing + Enhanced)
  // ============================================

  async syncProductsForTenant(ctx: RequestContext, tenantId: number): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) throw new Error(`Shopify settings not found for tenant ${tenantId}`);

    const data = await this.fetchFromShopify(settings, "products.json?limit=250");
    const products: any[] = data.products || [];
    let created = 0;
    let updated = 0;

    for (const sp of products) {
      try {
        // Check if product exists by custom field or external ID
        const existingProduct = await this.findProductByShopifyId(ctx, sp.id);

        if (existingProduct) {
          // Update existing product
          await this.updateVendureProduct(ctx, existingProduct, sp);
          updated++;
        } else {
          // Create new product
          await this.createVendureProduct(ctx, sp);
          created++;
        }
      } catch (err) {
        console.warn("Failed to sync product from Shopify:", sp.id, (err as any)?.message || err);
      }
    }

    return { result: `Synced ${created} created, ${updated} updated (total: ${products.length})` };
  }

  private async findProductByShopifyId(ctx: RequestContext, shopifyId: string): Promise<Product | null> {
    const repo = this.connection.getRepository(ctx, Product);
    // Assuming you store shopifyId in customFields
    return repo.findOne({ where: { customFields: { shopifyId } } } as any);
  }

  private async createVendureProduct(ctx: RequestContext, shopifyProduct: any): Promise<Product> {
    const createProductInput: any = {
      translations: [
        {
          languageCode: "en",
          name: shopifyProduct.title,
          slug: (shopifyProduct.handle || shopifyProduct.title || "").toString().toLowerCase().replace(/\s+/g, "-"),
          description: shopifyProduct.body_html || "",
        },
      ],
      enabled: shopifyProduct.status === 'active',
      customFields: {
        shopifyId: shopifyProduct.id.toString(),
      },
      variants: [],
    };

    if (Array.isArray(shopifyProduct.variants)) {
      for (const v of shopifyProduct.variants) {
        createProductInput.variants.push({
          sku: v.sku || `${shopifyProduct.id}-${v.id}`,
          price: v.price ? Math.round(parseFloat(v.price) * 100) : 0, // Convert to cents
          stockOnHand: v.inventory_quantity || 0,
          customFields: {
            shopifyVariantId: v.id.toString(),
          },
        });
      }
    }

    return this.productService.create(ctx, createProductInput);
  }

  private async updateVendureProduct(ctx: RequestContext, product: Product, shopifyProduct: any): Promise<Product> {
    const updateInput: any = {
      id: product.id,
      translations: [
        {
          languageCode: "en",
          name: shopifyProduct.title,
          slug: (shopifyProduct.handle || shopifyProduct.title || "").toString().toLowerCase().replace(/\s+/g, "-"),
          description: shopifyProduct.body_html || "",
        },
      ],
      enabled: shopifyProduct.status === 'active',
    };

    return this.productService.update(ctx, updateInput);
  }

  async syncCustomersForTenant(ctx: RequestContext, tenantId: number): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) throw new Error(`Shopify settings not found for tenant ${tenantId}`);

    const data = await this.fetchFromShopify(settings, "customers.json?limit=250");
    const customers: any[] = data.customers || [];
    let created = 0;

    for (const sc of customers) {
      try {
        // Check if customer exists
        const customerRepo = this.connection.getRepository(ctx, Customer);
        const existing = await customerRepo.findOne({ where: { emailAddress: sc.email } });

        if (!existing) {
          const input: any = {
            firstName: sc.first_name || "",
            lastName: sc.last_name || "",
            emailAddress: sc.email,
            customFields: {
              shopifyCustomerId: sc.id.toString(),
            },
          };

          await this.customerService.create(ctx, input);
          created++;
        }
      } catch (err) {
        console.warn("Failed to create customer from Shopify:", sc.id, (err as any)?.message || err);
      }
    }

    return { result: `Synced ${created} new customers (total: ${customers.length})` };
  }

  async syncOrdersForTenant(ctx: RequestContext, tenantId: number): Promise<{ result: string }> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) throw new Error(`Shopify settings not found for tenant ${tenantId}`);

    const data = await this.fetchFromShopify(settings, "orders.json?limit=250&status=any");
    const orders: any[] = data.orders || [];
    let processed = 0;

    for (const so of orders) {
      try {
        // Check if order already imported
        const orderRepo = this.connection.getRepository(ctx, Order);
        const existing = await orderRepo.findOne({ 
          where: { customFields: { shopifyOrderId: so.id.toString() } } 
        } as any);

        if (!existing) {
          await this.importShopifyOrder(ctx, so);
          processed++;
        }
      } catch (err) {
        console.warn("Failed to import Shopify order:", so.id, (err as any)?.message || err);
      }
    }

    return { result: `Imported ${processed} new orders (total: ${orders.length})` };
  }

  private async importShopifyOrder(ctx: RequestContext, shopifyOrder: any): Promise<void> {
    // Find or create customer
    let customer: Customer | null = null;
    if (shopifyOrder.email) {
      const customerRepo = this.connection.getRepository(ctx, Customer);
      customer = await customerRepo.findOne({ where: { emailAddress: shopifyOrder.email } });
    }

    // Map line items to Vendure variants
    const lines = [];
    for (const li of shopifyOrder.line_items || []) {
      // Try to find variant by SKU or Shopify variant ID
      const variantRepo = this.connection.getRepository(ctx, ProductVariant);
      const variant = await variantRepo.findOne({ 
        where: [
          { sku: li.sku },
          { customFields: { shopifyVariantId: li.variant_id?.toString() } }
        ]
      } as any);

      if (variant) {
        lines.push({
          productVariantId: variant.id,
          quantity: li.quantity,
        });
      }
    }

    // Note: Creating orders programmatically in Vendure requires using the Order workflow
    // This is a simplified example - actual implementation would need proper order state management
    console.log('Order import prepared:', {
      customerId: customer?.id,
      lines,
      shopifyOrderId: shopifyOrder.id,
    });
  }

  // ============================================
  // VENDURE → SHOPIFY SYNC (New)
  // ============================================

  async syncProductToShopify(ctx: RequestContext, product: Product): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      const shopifyId = (product as any).customFields?.shopifyId;

      // Load full product with variants
      const fullProduct = await this.productService.findOne(ctx, product.id);
      if (!fullProduct) return;

      const shopifyProductData = {
        product: {
          title: fullProduct.name,
          body_html: fullProduct.description,
          status: fullProduct.enabled ? 'active' : 'draft',
          variants: (fullProduct.variants || []).map((v: ProductVariant) => ({
            id: (v as any).customFields?.shopifyVariantId,
            sku: v.sku,
            price: (v.price / 100).toFixed(2),
            inventory_quantity: v.stockLevel ? (v.stockLevel as any).stockOnHand : 0,
          })),
        },
      };

      if (shopifyId) {
        // Update existing product
        await this.putToShopify(settings, `products/${shopifyId}.json`, shopifyProductData);
      } else {
        // Create new product
        const response = await this.postToShopify(settings, 'products.json', shopifyProductData);
        
        // Store Shopify ID back to Vendure
        await this.productService.update(ctx, {
          id: product.id,
          customFields: {
            shopifyId: response.product.id.toString(),
          },
        });
      }
    } catch (err) {
      console.error('Failed to sync product to Shopify:', err);
    }
  }

  async syncCustomerToShopify(ctx: RequestContext, customer: Customer): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      const shopifyId = (customer as any).customFields?.shopifyCustomerId;

      const shopifyCustomerData = {
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.emailAddress,
        },
      };

      if (shopifyId) {
        await this.putToShopify(settings, `customers/${shopifyId}.json`, shopifyCustomerData);
      } else {
        const response = await this.postToShopify(settings, 'customers.json', shopifyCustomerData);
        
        // Store Shopify ID back to Vendure
        const customerRepo = this.connection.getRepository(ctx, Customer);
        customer.customFields = customer.customFields || {};
        (customer.customFields as any).shopifyCustomerId = response.customer.id.toString();
        await customerRepo.save(customer);
      }
    } catch (err) {
      console.error('Failed to sync customer to Shopify:', err);
    }
  }

  async syncOrderToShopify(ctx: RequestContext, order: Order): Promise<void> {
    try {
      const tenantId = (ctx as any).channel?.tenantId || 1;
      const settings = await this.getSettingsByTenant(ctx, tenantId);
      if (!settings) return;

      // Only sync orders that originated in Vendure (no shopifyOrderId)
      const shopifyOrderId = (order as any).customFields?.shopifyOrderId;
      if (shopifyOrderId) return;

      // Build Shopify draft order
      const shopifyDraftOrder = {
        draft_order: {
          line_items: order.lines.map(line => ({
            variant_id: (line.productVariant as any).customFields?.shopifyVariantId,
            quantity: line.quantity,
          })),
          customer: {
            id: (order.customer as any).customFields?.shopifyCustomerId,
          },
          email: order.customer?.emailAddress,
          note: `Vendure Order #${order.code}`,
        },
      };

      await this.postToShopify(settings, 'draft_orders.json', shopifyDraftOrder);
    } catch (err) {
      console.error('Failed to sync order to Shopify:', err);
    }
  }

  // Webhook handling for real-time sync
  async handleWebhook(ctx: RequestContext, tenantId: number, event: string, payload: any): Promise<void> {
    const settings = await this.getSettingsByTenant(ctx, tenantId);
    if (!settings) return;

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
        console.log(`Unhandled webhook event: ${event}`);
    }
  }
}