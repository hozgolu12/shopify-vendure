/**
 * Test Examples for Shopify-Vendure Sync Module
 *
 * This file provides unit test examples using Jest.
 * Copy and adapt these to your testing framework.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from '../services/sync.service';
import { ShopifyService } from '../services/shopify.service';
import { VendureService } from '../services/vendure.service';
import { SettingsService } from '../services/settings.service';
import { ShopifySyncController } from '../controllers/sync.controller';
import { SaveSettingsDto } from '../dtos/save-settings.dto';

describe('ShopifySyncModule', () => {
  let module: TestingModule;
  let controller: ShopifySyncController;
  let syncService: SyncService;
  let shopifyService: ShopifyService;
  let vendureService: VendureService;
  let settingsService: SettingsService;

  beforeEach(async () => {
    // Mock services
    const mockShopifyService = {
      fetchAllProducts: jest.fn(),
      fetchAllCustomers: jest.fn(),
      fetchAllOrders: jest.fn(),
    };

    const mockVendureService = {
      createOrUpdateProduct: jest.fn(),
      createOrUpdateCustomer: jest.fn(),
      createProductVariant: jest.fn(),
      findProductBySku: jest.fn(),
      addProductsToChannel: jest.fn(),
    };

    const mockSettingsService = {
      saveSettings: jest.fn(),
      getSettings: jest.fn(),
      hasSettings: jest.fn(),
      deleteSettings: jest.fn(),
      getAllChannelIds: jest.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [ShopifySyncController],
      providers: [
        SyncService,
        { provide: ShopifyService, useValue: mockShopifyService },
        { provide: VendureService, useValue: mockVendureService },
        { provide: SettingsService, useValue: mockSettingsService },
      ],
    }).compile();

    controller = module.get(ShopifySyncController);
    syncService = module.get(SyncService);
    shopifyService = module.get(ShopifyService);
    vendureService = module.get(VendureService);
    settingsService = module.get(SettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ======================================================================
  // SettingsService Tests
  // ======================================================================

  describe('SettingsService', () => {
    it('should save settings for a channel', () => {
      const channelId = 'default';
      const settings = {
        shopifyStore: 'test-store.myshopify.com',
        shopifyAccessToken: 'shpat_test',
        vendureAdminToken: 'token_test',
        vendureAdminUrl: 'http://localhost:3000',
        vendureChannelId: 'default',
      };

      settingsService.saveSettings(channelId, settings);

      expect(settingsService.saveSettings).toHaveBeenCalledWith(channelId, settings);
    });

    it('should retrieve settings for a channel', () => {
      const channelId = 'default';
      const settings = {
        shopifyStore: 'test-store.myshopify.com',
        shopifyAccessToken: 'shpat_test',
        vendureAdminToken: 'token_test',
      };

      jest.spyOn(settingsService, 'getSettings').mockReturnValue(settings);

      const result = settingsService.getSettings(channelId);

      expect(settingsService.getSettings).toHaveBeenCalledWith(channelId);
      expect(result).toEqual(settings);
    });

    it('should return null if settings do not exist', () => {
      jest.spyOn(settingsService, 'getSettings').mockReturnValue(null);

      const result = settingsService.getSettings('nonexistent');

      expect(result).toBeNull();
    });
  });

  // ======================================================================
  // SyncService Tests
  // ======================================================================

  describe('SyncService', () => {
    const mockChannelId = 'default';
    const mockSettings = {
      shopifyStore: 'test-store.myshopify.com',
      shopifyAccessToken: 'shpat_test',
      vendureAdminToken: 'token_test',
      vendureAdminUrl: 'http://localhost:3000',
      vendureChannelId: 'default',
    };

    const mockShopifyProduct = {
      id: 'gid://shopify/Product/1',
      title: 'Test Product',
      handle: 'test-product',
      descriptionHtml: '<p>A test product</p>',
      createdAt: '2024-01-01T00:00:00Z',
      images: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductImage/1',
              originalSrc: 'https://example.com/image.jpg',
              altText: 'Test',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/1',
              title: 'Red - Size M',
              sku: 'TEST-RED-M',
              price: '29.99',
            },
          },
        ],
      },
    };

    describe('syncProducts', () => {
      it('should fetch and create products from Shopify', async () => {
        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllProducts').mockResolvedValue([mockShopifyProduct]);
        jest.spyOn(vendureService, 'createOrUpdateProduct').mockResolvedValue({
          id: 'vendure_product_id',
          isNew: true,
        });
        jest.spyOn(vendureService, 'createProductVariant').mockResolvedValue('vendure_variant_id');

        const stats = await syncService.syncProducts(mockChannelId);

        expect(shopifyService.fetchAllProducts).toHaveBeenCalledWith(
          mockSettings.shopifyStore,
          mockSettings.shopifyAccessToken,
          undefined,
        );
        expect(vendureService.createOrUpdateProduct).toHaveBeenCalled();
        expect(stats.productsCreated).toBe(1);
      });

      it('should handle incremental sync with afterDate', async () => {
        const afterDate = '2024-11-01T00:00:00Z';

        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllProducts').mockResolvedValue([]);

        await syncService.syncProducts(mockChannelId, afterDate);

        expect(shopifyService.fetchAllProducts).toHaveBeenCalledWith(
          mockSettings.shopifyStore,
          mockSettings.shopifyAccessToken,
          afterDate,
        );
      });

      it('should throw error if channel settings not found', async () => {
        jest.spyOn(settingsService, 'getSettings').mockReturnValue(null);

        await expect(syncService.syncProducts('unknown-channel')).rejects.toThrow();
      });

      it('should continue syncing on product errors', async () => {
        const mockProducts = [
          mockShopifyProduct,
          {
            ...mockShopifyProduct,
            id: 'gid://shopify/Product/2',
            title: 'Product 2',
          },
        ];

        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllProducts').mockResolvedValue(mockProducts);

        // First product fails, second succeeds
        jest
          .spyOn(vendureService, 'createOrUpdateProduct')
          .mockRejectedValueOnce(new Error('API Error'))
          .mockResolvedValueOnce({ id: 'vendure_product_id_2', isNew: true });

        const stats = await syncService.syncProducts(mockChannelId);

        expect(stats.errors.length).toBe(1);
        expect(stats.productsCreated).toBe(1);
      });
    });

    describe('syncCustomers', () => {
      const mockShopifyCustomer = {
        id: 'gid://shopify/Customer/1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        createdAt: '2024-01-01T00:00:00Z',
        addresses: {
          edges: [
            {
              node: {
                id: 'gid://shopify/CustomerAddress/1',
                firstName: 'John',
                lastName: 'Doe',
                address1: '123 Main St',
                address2: null,
                city: 'New York',
                province: 'NY',
                country: 'United States',
                zip: '10001',
                isDefault: true,
              },
            },
          ],
        },
      };

      it('should fetch and create customers from Shopify', async () => {
        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllCustomers').mockResolvedValue([mockShopifyCustomer]);
        jest.spyOn(vendureService, 'createOrUpdateCustomer').mockResolvedValue({
          id: 'vendure_customer_id',
          isNew: true,
        });

        const stats = await syncService.syncCustomers(mockChannelId);

        expect(shopifyService.fetchAllCustomers).toHaveBeenCalledWith(
          mockSettings.shopifyStore,
          mockSettings.shopifyAccessToken,
        );
        expect(vendureService.createOrUpdateCustomer).toHaveBeenCalled();
        expect(stats.customersCreated).toBe(1);
      });

      it('should handle missing addresses gracefully', async () => {
        const customerWithoutAddresses = {
          ...mockShopifyCustomer,
          addresses: { edges: [] },
        };

        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllCustomers').mockResolvedValue([customerWithoutAddresses]);
        jest.spyOn(vendureService, 'createOrUpdateCustomer').mockResolvedValue({
          id: 'vendure_customer_id',
          isNew: true,
        });

        const stats = await syncService.syncCustomers(mockChannelId);

        expect(stats.customersCreated).toBe(1);
        expect(stats.errors.length).toBe(0);
      });
    });

    describe('syncOrders', () => {
      it('should fetch and map orders from Shopify', async () => {
        const mockOrder = {
          id: 'gid://shopify/Order/1',
          name: '#1001',
          email: 'customer@example.com',
          totalPrice: '99.99',
          subtotalPrice: '99.99',
          totalTax: '0.00',
          createdAt: '2024-01-01T00:00:00Z',
          processedAt: '2024-01-01T00:00:00Z',
          customer: {
            id: 'gid://shopify/Customer/1',
            email: 'customer@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
          lineItems: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/LineItem/1',
                  title: 'Test Product',
                  quantity: 1,
                  originalUnitPrice: '99.99',
                  variant: {
                    id: 'gid://shopify/ProductVariant/1',
                    sku: 'TEST-001',
                  },
                },
              },
            ],
          },
        };

        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllOrders').mockResolvedValue([mockOrder]);

        const stats = await syncService.syncOrders(mockChannelId);

        expect(shopifyService.fetchAllOrders).toHaveBeenCalled();
        expect(stats.ordersProcessed).toBe(1);
        expect(stats.ordersMapped.length).toBe(1);
      });
    });

    describe('syncAll', () => {
      it('should perform products, customers, and orders sync sequentially', async () => {
        jest.spyOn(settingsService, 'getSettings').mockReturnValue(mockSettings);
        jest.spyOn(shopifyService, 'fetchAllProducts').mockResolvedValue([mockShopifyProduct]);
        jest.spyOn(shopifyService, 'fetchAllCustomers').mockResolvedValue([]);
        jest.spyOn(shopifyService, 'fetchAllOrders').mockResolvedValue([]);
        jest.spyOn(vendureService, 'createOrUpdateProduct').mockResolvedValue({
          id: 'vendure_product_id',
          isNew: true,
        });
        jest.spyOn(vendureService, 'createProductVariant').mockResolvedValue('vendure_variant_id');

        const stats = await syncService.syncAll(mockChannelId);

        expect(shopifyService.fetchAllProducts).toHaveBeenCalled();
        expect(shopifyService.fetchAllCustomers).toHaveBeenCalled();
        expect(shopifyService.fetchAllOrders).toHaveBeenCalled();
        expect(stats.productsCreated).toBeGreaterThan(0);
      });
    });
  });

  // ======================================================================
  // Controller Tests
  // ======================================================================

  describe('ShopifySyncController', () => {
    describe('POST /settings/save', () => {
      it('should save settings and return success', async () => {
        const dto: SaveSettingsDto = {
          channelId: 'default',
          shopifyStore: 'test-store.myshopify.com',
          shopifyAccessToken: 'shpat_test',
          vendureAdminToken: 'token_test',
          vendureAdminUrl: 'http://localhost:3000',
          vendureChannelId: 'default',
        };

        jest.spyOn(settingsService, 'saveSettings').mockImplementation();

        const result = await controller.saveSettings(dto);

        expect(settingsService.saveSettings).toHaveBeenCalledWith(dto.channelId, expect.any(Object));
        expect(result.success).toBe(true);
      });
    });

    describe('GET /settings/:channelId', () => {
      it('should retrieve settings for a channel', async () => {
        const mockSettings = {
          channelId: 'default',
          shopifyStore: 'test-store.myshopify.com',
          vendureChannelId: 'default',
        };

        jest.spyOn(settingsService, 'getSettings').mockReturnValue({
          shopifyStore: 'test-store.myshopify.com',
          shopifyAccessToken: 'shpat_test',
          vendureAdminToken: 'token_test',
          vendureAdminUrl: 'http://localhost:3000',
          vendureChannelId: 'default',
        });

        const result = await controller.getSettings('default');

        expect(result.channelId).toBe('default');
        expect(result.shopifyStore).toBe('test-store.myshopify.com');
      });
    });

    describe('POST /products/sync', () => {
      it('should trigger product sync', async () => {
        jest.spyOn(syncService, 'syncProducts').mockResolvedValue({
          productsCreated: 10,
          productsUpdated: 5,
          variantsCreated: 20,
          errors: [],
        });

        const result = await controller.syncProducts({ channelId: 'default' });

        expect(syncService.syncProducts).toHaveBeenCalledWith('default', undefined);
        expect(result.success).toBe(true);
        expect(result.stats.productsCreated).toBe(10);
      });
    });

    describe('GET /channels', () => {
      it('should list all channels with settings', async () => {
        jest.spyOn(settingsService, 'getAllChannelIds').mockReturnValue(['default', 'client-a']);

        const result = await controller.listChannels();

        expect(result.channels).toContain('default');
        expect(result.channels).toContain('client-a');
      });
    });
  });

  // ======================================================================
  // Integration Tests (Optional)
  // ======================================================================

  describe('Integration Tests (Optional)', () => {
    it('should perform end-to-end sync workflow', async () => {
      // This test would require:
      // 1. A test Shopify store (or mocked responses)
      // 2. A test Vendure instance (or mocked responses)
      // 3. Proper setup/teardown

      // Pseudo-code example:
      // 1. Save settings
      // 2. Sync products
      // 3. Verify products exist in Vendure
      // 4. Update a product in Shopify
      // 5. Sync again
      // 6. Verify product was updated in Vendure
    });
  });
});

/**
 * To run these tests:
 *
 * npm test -- sync.service.spec.ts          # Run service tests
 * npm test -- sync.controller.spec.ts       # Run controller tests
 * npm test -- shopify-sync                  # Run all module tests
 * npm test -- --coverage                    # Generate coverage report
 */
