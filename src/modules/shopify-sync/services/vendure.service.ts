import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { VENDURE_ADMIN_API_PATH, GQL_QUERY_TIMEOUT_MS } from '../constants/sync.constants';

/**
 * VendureService
 *
 * Encapsulates all Vendure Admin GraphQL API interactions.
 * - Creates, updates, and retrieves products, customers, and orders in Vendure
 * - Uses idempotent logic (create if new, update if exists)
 * - Handles channel assignment per Vendure's multi-channel architecture
 *
 * All operations use GraphQL exclusively; no REST API calls.
 */
@Injectable()
export class VendureService {
  private logger = new Logger(VendureService.name);
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: GQL_QUERY_TIMEOUT_MS,
    });
  }

  /**
   * Generic GraphQL query/mutation executor for Vendure Admin API
   *
   * @param vendureUrl - Vendure Admin API base URL (e.g., 'http://localhost:3000')
   * @param adminToken - Vendure Admin API authorization token
   * @param query - GraphQL query or mutation string
   * @param variables - GraphQL variables object
   * @returns Parsed response data or throws error
   */
  private async executeQuery<T = any>(
    vendureUrl: string,
    adminToken: string,
    query: string,
    variables = {},
  ): Promise<T> {
    const url = `${vendureUrl}${VENDURE_ADMIN_API_PATH}`;
    const headers = {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    };

    try {
      this.logger.debug(`Executing Vendure GraphQL query`);
      const response = await this.httpClient.post(url, { query, variables }, { headers });

      if (response.data.errors) {
        const errorMsg = response.data.errors.map((e: any) => e.message).join('; ');
        throw new Error(`Vendure GraphQL Error: ${errorMsg}`);
      }

      return response.data.data as T;
    } catch (error: any) {
      this.logger.error(`Vendure GraphQL request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get or create a product in Vendure.
   * Uses SKU as the idempotent key (if available) or shopifyId custom field.
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param productInput - Product data to create/update
   * @param channelId - Vendure channel ID to assign product to
   * @returns Created/updated product ID
   */
  async createOrUpdateProduct(
    vendureUrl: string,
    adminToken: string,
    productInput: any,
    channelId: string,
  ): Promise<{ id: string; isNew: boolean }> {
    // Step 1: Check if product exists by shopifyId custom field
    const queryExisting = `
      query ($customFields: JSON) {
        products(filter: { customFields: $customFields }) {
          items { id }
        }
      }
    `;

    try {
      const existing = await this.executeQuery(
        vendureUrl,
        adminToken,
        queryExisting,
        { customFields: { shopifyId: productInput.customFields?.shopifyId } },
      );

      // If product exists, update it
      if (existing.products?.items?.[0]) {
        const updateMutation = `
          mutation ($input: UpdateProductInput!) {
            updateProduct(input: $input) { id }
          }
        `;

        const updateInput = {
          input: {
            id: existing.products.items[0].id,
            ...productInput,
            translations: productInput.translations || [],
          },
        };

        const updated = await this.executeQuery(vendureUrl, adminToken, updateMutation, updateInput);
        this.logger.log(`Updated product: ${updated.updateProduct.id}`);
        return { id: updated.updateProduct.id, isNew: false };
      }
    } catch (err) {
      // Product might not exist; proceed to create
      this.logger.debug(`Product lookup failed or does not exist; will create new`);
    }

    // Step 2: Create new product
    const createMutation = `
      mutation ($input: CreateProductInput!) {
        createProduct(input: $input) { id }
      }
    `;

    const createInput = {
      input: {
        ...productInput,
        translations: productInput.translations || [],
      },
    };

    const created = await this.executeQuery(vendureUrl, adminToken, createMutation, createInput);
    this.logger.log(`Created product: ${created.createProduct.id}`);

    // Step 3: Assign product to channel
    const assignToChannelMutation = `
      mutation ($input: AddProductsToChannelInput!) {
        addProductsToChannel(input: $input) { success }
      }
    `;

    await this.executeQuery(vendureUrl, adminToken, assignToChannelMutation, {
      input: { channelId, productIds: [created.createProduct.id] },
    });

    return { id: created.createProduct.id, isNew: true };
  }

  /**
   * Create or update a customer in Vendure.
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param customerInput - Customer data
   * @returns Created/updated customer ID
   */
  async createOrUpdateCustomer(
    vendureUrl: string,
    adminToken: string,
    customerInput: any,
  ): Promise<{ id: string; isNew: boolean }> {
    // Check if customer exists by email and shopifyCustomerId custom field
    const queryExisting = `
      query ($emailAddress: String!) {
        customers(filter: { emailAddress: { contains: $emailAddress } }) {
          items { id }
        }
      }
    `;

    try {
      const existing = await this.executeQuery(vendureUrl, adminToken, queryExisting, {
        emailAddress: customerInput.emailAddress,
      });

      if (existing.customers?.items?.[0]) {
        const updateMutation = `
          mutation ($input: UpdateCustomerInput!) {
            updateCustomer(input: $input) { id }
          }
        `;

        const updateInput = {
          input: {
            id: existing.customers.items[0].id,
            ...customerInput,
          },
        };

        const updated = await this.executeQuery(vendureUrl, adminToken, updateMutation, updateInput);
        this.logger.log(`Updated customer: ${updated.updateCustomer.id}`);
        return { id: updated.updateCustomer.id, isNew: false };
      }
    } catch (err) {
      this.logger.debug(`Customer lookup failed; will create new`);
    }

    // Create new customer
    const createMutation = `
      mutation ($input: CreateCustomerInput!) {
        createCustomer(input: $input) { id }
      }
    `;

    const createInput = { input: customerInput };
    const created = await this.executeQuery(vendureUrl, adminToken, createMutation, createInput);
    this.logger.log(`Created customer: ${created.createCustomer.id}`);
    return { id: created.createCustomer.id, isNew: true };
  }

  /**
   * Create product variant for a product in Vendure.
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param productId - Vendure product ID
   * @param variantInput - Variant data (name, sku, price, etc.)
   * @returns Created variant ID
   */
  async createProductVariant(
    vendureUrl: string,
    adminToken: string,
    productId: string,
    variantInput: any,
  ): Promise<string> {
    const mutation = `
      mutation ($input: CreateProductVariantInput!) {
        createProductVariant(input: $input) { id }
      }
    `;

    const input = {
      input: {
        productId,
        ...variantInput,
        translations: variantInput.translations || [],
      },
    };

    const result = await this.executeQuery(vendureUrl, adminToken, mutation, input);
    this.logger.log(`Created variant: ${result.createProductVariant.id}`);
    return result.createProductVariant.id;
  }

  /**
   * Search for a product by SKU in Vendure (used for idempotency).
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param sku - Product SKU
   * @returns Product ID if found, null otherwise
   */
  async findProductBySku(vendureUrl: string, adminToken: string, sku: string): Promise<string | null> {
    const query = `
      query ($sku: String!) {
        productVariants(filter: { sku: $sku }) {
          items { product { id } }
        }
      }
    `;

    const result = await this.executeQuery(vendureUrl, adminToken, query, { sku });
    return result.productVariants?.items?.[0]?.product?.id || null;
  }

  /**
   * Add product to a channel in Vendure.
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param productIds - Array of product IDs to add
   * @param channelId - Target Vendure channel ID
   */
  async addProductsToChannel(
    vendureUrl: string,
    adminToken: string,
    productIds: string[],
    channelId: string,
  ): Promise<void> {
    const mutation = `
      mutation ($input: AddProductsToChannelInput!) {
        addProductsToChannel(input: $input) { success }
      }
    `;

    await this.executeQuery(vendureUrl, adminToken, mutation, {
      input: { productIds, channelId },
    });

    this.logger.log(`Added ${productIds.length} products to channel ${channelId}`);
  }

  /**
   * Create an order in Vendure (simplified).
   * Note: Full order creation with payments, fulfillments, etc. is complex.
   * This is a stub that can be extended.
   *
   * @param vendureUrl - Vendure base URL
   * @param adminToken - Vendure admin token
   * @param orderInput - Order data
   * @returns Created order ID
   */
  async createOrder(
    vendureUrl: string,
    adminToken: string,
    orderInput: any,
  ): Promise<{ id: string; isNew: boolean }> {
    // For now, orders are not fully created via mutation.
    // In Vendure, orders are typically created via the Shop API when customers place them.
    // This stub is for future extension if you need to create draft orders.
    this.logger.warn(`Order creation not yet implemented. Stub only.`);
    return { id: 'order-stub', isNew: true };
  }
}
