import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import "dotenv/config";
import path from "path";
import { CustomerRelationPlugin } from "./plugins/customer-relation/customer-relation.plugin";
import { measurementsSchema } from "./schema/customer/measurements.schema";
import { UserPlugin } from "./plugins/tenant-user/user.plugin";
import { CompanyPlugin } from "./plugins/tenant-company/company.plugin";
import { TenantInventoryPlugin } from "./plugins/tenant-inventory/tenant-inventory.plugin";
import { WorkspacePlugin } from "./plugins/tenant-workspace/tenant-workspace.plugin";
import { ProductKitPlugin } from "./plugins/product-kit/product-kit.plugin";
import { productTypeSchema } from "./schema/product/product-type.schema";
import { ProductionOrderPlugin } from "./plugins/production-order/production-order.plugin";
import { itemConfigSchema } from "./schema/product/item-config.schema";
import { ProductionOrderTaskPlugin } from "./plugins/production-order-task/production-order-task.plugin";
import { ArtisanTaskTimesheetPlugin } from "./plugins/artisans-task-timesheet/artisans-task-timesheet.plugin";
import { ShopifyIntegrationPlugin } from './plugins/shopify-integration/shopify-integration.plugin';

const IS_DEV = process.env.APP_ENV === "dev";

export const config: VendureConfig = {
  apiOptions: {
    port: +(process.env.PORT || 3000),
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { "request.credentials": "include" } as any,
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { "request.credentials": "include" } as any,
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(ts|js)")],
    logging: false,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_CA_CERT
      ? {
          ca: process.env.DB_CA_CERT,
        }
      : undefined,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  entityOptions: {},
  customFields: {
    Product: [
      productTypeSchema, 
      itemConfigSchema,
      // Shopify integration field
      {
        name: "shopifyId",
        type: "string",
        nullable: true,
        public: false,
        label: [{ languageCode: LanguageCode.en, value: "Shopify Product ID" }],
      }
    ],
    ProductVariant: [
      // Shopify integration field
      {
        name: "shopifyVariantId",
        type: "string",
        nullable: true,
        public: false,
        label: [{ languageCode: LanguageCode.en, value: "Shopify Variant ID" }],
      }
    ],
    Customer: [
      measurementsSchema,
      // Shopify integration field
      {
        name: "shopifyCustomerId",
        type: "string",
        nullable: true,
        public: false,
        label: [{ languageCode: LanguageCode.en, value: "Shopify Customer ID" }],
      }
    ],
    Order: [
      // Shopify integration field
      {
        name: "shopifyOrderId",
        type: "string",
        nullable: true,
        public: false,
        label: [{ languageCode: LanguageCode.en, value: "Shopify Order ID" }],
      }
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir:
        process.env.ASSET_UPLOAD_DIR ||
        path.join(__dirname, "../static/assets"),
      storageStrategyFactory: process.env.MINIO_ENDPOINT
        ? configureS3AssetStorage({
            bucket: "vendure-assets",
            credentials: {
              accessKeyId: process.env.MINIO_ACCESS_KEY || "",
              secretAccessKey: process.env.MINIO_SECRET_KEY || "",
            },
            nativeS3Configuration: {
              endpoint: process.env.MINIO_ENDPOINT,
              forcePathStyle: true,
              signatureVersion: "v4",
              region: "eu-west-1",
            },
          })
        : undefined,
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
      app: compileUiExtensions({
        outputPath: path.join(__dirname, "../admin-ui"),
        extensions: [
          CustomerRelationPlugin.ui, 
          ProductKitPlugin.ui,
          ShopifyIntegrationPlugin.ui
        ],
        devMode: true,
      }),
    }),
    CustomerRelationPlugin,
    UserPlugin,
    CompanyPlugin,
    TenantInventoryPlugin.init({}),
    WorkspacePlugin.init({}),
    ProductKitPlugin.init({}),
    ProductionOrderPlugin.init({}),
    ProductionOrderTaskPlugin.init({}),
    ArtisanTaskTimesheetPlugin.init({}),
    ShopifyIntegrationPlugin.init({}),
  ],
};