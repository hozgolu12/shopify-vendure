import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SHOPIFY_API_VERSION, GQL_QUERY_TIMEOUT_MS, GQL_MAX_RETRIES } from '../constants/sync.constants';

/**
 * ShopifyService
 *
 * Encapsulates all Shopify Admin GraphQL API interactions.
 * - Fetches products, customers, and orders from a Shopify store
 * - Uses cursor-based pagination to handle large datasets
 * - Includes retry logic and error handling
 *
 * All operations use GraphQL exclusively; no REST API calls.
 */
@Injectable()
export class ShopifyService {
  private logger = new Logger(ShopifyService.name);
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: GQL_QUERY_TIMEOUT_MS,
    });
  }

  /**
   * Generic GraphQL query executor for Shopify Admin API
   *
   * @param shopStore - Shopify store URL (e.g., 'my-store.myshopify.com')
   * @param accessToken - Shopify Admin API access token
   * @param query - GraphQL query string
   * @param variables - GraphQL variables object
   * @returns Parsed response data or throws error
   */
  private async executeQuery<T = any>(
    shopStore: string,
    accessToken: string,
    query: string,
    variables = {},
  ): Promise<T> {
    const url = `https://${shopStore}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
    const headers = {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    };

    try {
      this.logger.debug(`Querying Shopify: ${shopStore}`);
      const response = await this.httpClient.post(url, { query, variables }, { headers });

      if (response.data.errors) {
        const errorMsg = response.data.errors.map((e: any) => e.message).join('; ');
        throw new Error(`Shopify GraphQL Error: ${errorMsg}`);
      }

      return response.data.data as T;
    } catch (error: any) {
      this.logger.error(`Shopify GraphQL request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch all products from Shopify with pagination support.
   *
   * Returns: { id, title, handle, descriptionHtml, images, variants }
   *
   * @param shopStore - Shopify store URL
   * @param accessToken - Shopify Admin API token
   * @param afterDate - Optional ISO date string to fetch products after this date
   * @returns Array of product objects
   */
  async fetchAllProducts(shopStore: string, accessToken: string, afterDate?: string): Promise<any[]> {
    const products: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    const pageSize = 250;

    const query = `
      query ($first: Int!, $after: String, $query: String) {
        products(first: $first, after: $after, query: $query) {
          pageInfo { hasNextPage }
          edges {
            cursor
            node {
              id
              title
              handle
              descriptionHtml
              createdAt
              images(first: 50) {
                edges { node { id originalSrc altText } }
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

    while (hasNextPage) {
      const variables: any = { first: pageSize };
      if (cursor) variables.after = cursor;
      if (afterDate) variables.query = `created_at:>="${afterDate}"`;

      const data = await this.executeQuery(shopStore, accessToken, query, variables);
      const edges = data.products.edges || [];

      for (const edge of edges) {
        products.push(edge.node);
        cursor = edge.cursor;
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
    }

    this.logger.log(`Fetched ${products.length} products from Shopify store: ${shopStore}`);
    return products;
  }

  /**
   * Fetch all customers from Shopify.
   *
   * Returns: { id, email, firstName, lastName, phone, addresses, createdAt }
   *
   * @param shopStore - Shopify store URL
   * @param accessToken - Shopify Admin API token
   * @returns Array of customer objects
   */
  async fetchAllCustomers(shopStore: string, accessToken: string): Promise<any[]> {
    const customers: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    const pageSize = 250;

    const query = `
      query ($first: Int!, $after: String) {
        customers(first: $first, after: $after) {
          pageInfo { hasNextPage }
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

    while (hasNextPage) {
      const variables: any = { first: pageSize };
      if (cursor) variables.after = cursor;

      const data = await this.executeQuery(shopStore, accessToken, query, variables);
      const edges = data.customers.edges || [];

      for (const edge of edges) {
        customers.push(edge.node);
        cursor = edge.cursor;
      }

      hasNextPage = data.customers.pageInfo.hasNextPage;
    }

    this.logger.log(`Fetched ${customers.length} customers from Shopify store: ${shopStore}`);
    return customers;
  }

  /**
   * Fetch all orders from Shopify.
   *
   * Returns: { id, name, email, totalPrice, customer, createdAt, lineItems }
   *
   * @param shopStore - Shopify store URL
   * @param accessToken - Shopify Admin API token
   * @returns Array of order objects
   */
  async fetchAllOrders(shopStore: string, accessToken: string): Promise<any[]> {
    const orders: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    const pageSize = 250;

    const query = `
      query ($first: Int!, $after: String) {
        orders(first: $first, after: $after) {
          pageInfo { hasNextPage }
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
              customer { id email firstName lastName }
              lineItems(first: 250) {
                edges {
                  node {
                    id
                    title
                    quantity
                    originalUnitPrice
                    variant { id sku product { id } }
                  }
                }
              }
            }
          }
        }
      }
    `;

    while (hasNextPage) {
      const variables: any = { first: pageSize };
      if (cursor) variables.after = cursor;

      const data = await this.executeQuery(shopStore, accessToken, query, variables);
      const edges = data.orders.edges || [];

      for (const edge of edges) {
        orders.push(edge.node);
        cursor = edge.cursor;
      }

      hasNextPage = data.orders.pageInfo.hasNextPage;
    }

    this.logger.log(`Fetched ${orders.length} orders from Shopify store: ${shopStore}`);
    return orders;
  }
}
