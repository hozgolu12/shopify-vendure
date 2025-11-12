import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShopifyCustomFields1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add shopifyId to Product custom fields
    await queryRunner.query(`
      ALTER TABLE "product" 
      ADD COLUMN IF NOT EXISTS "customFieldsShopifyid" character varying
    `);

    // Add shopifyVariantId to ProductVariant custom fields
    await queryRunner.query(`
      ALTER TABLE "product_variant" 
      ADD COLUMN IF NOT EXISTS "customFieldsShopifyvariantid" character varying
    `);

    // Add shopifyCustomerId to Customer custom fields
    await queryRunner.query(`
      ALTER TABLE "customer" 
      ADD COLUMN IF NOT EXISTS "customFieldsShopifycustomerid" character varying
    `);

    // Add shopifyOrderId to Order custom fields
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD COLUMN IF NOT EXISTS "customFieldsShopifyorderid" character varying
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_product_shopify_id" 
      ON "product" ("customFieldsShopifyid")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_product_variant_shopify_id" 
      ON "product_variant" ("customFieldsShopifyvariantid")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_customer_shopify_id" 
      ON "customer" ("customFieldsShopifycustomerid")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_order_shopify_id" 
      ON "order" ("customFieldsShopifyorderid")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_shopify_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_variant_shopify_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_customer_shopify_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_shopify_id"`);

    // Remove columns
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsShopifyid"`);
    await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "customFieldsShopifyvariantid"`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "customFieldsShopifycustomerid"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "customFieldsShopifyorderid"`);
  }
}