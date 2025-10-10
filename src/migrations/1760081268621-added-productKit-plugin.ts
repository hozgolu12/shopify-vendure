import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedProductKitPlugin1760081268621 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."product_kit_discounttype_enum" AS ENUM('PERCENTAGE', 'FIXED')`, undefined);
        await queryRunner.query(`CREATE TABLE "product_kit" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "barcode" character varying NOT NULL, "itemKitName" character varying NOT NULL, "description" text, "discountType" "public"."product_kit_discounttype_enum" NOT NULL DEFAULT 'PERCENTAGE', "discountValue" numeric(10,2) NOT NULL DEFAULT '0', "channelId" integer NOT NULL, CONSTRAINT "UQ_product_kit_channel_name" UNIQUE ("itemKitName", "channelId"), CONSTRAINT "UQ_product_kit_channel_barcode" UNIQUE ("barcode", "channelId"), CONSTRAINT "PK_aae0c2f98fb7e83979549442ed3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "product_kit_variants" ("productKitId" integer NOT NULL, "productVariantId" integer NOT NULL, CONSTRAINT "PK_34066f0cda255422e8824e8c13b" PRIMARY KEY ("productKitId", "productVariantId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_66067c1f50cd9ac35d334b4246" ON "product_kit_variants" ("productKitId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_05bd3738453d3fb49d724b650d" ON "product_kit_variants" ("productVariantId") `, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" ADD CONSTRAINT "FK_47f5b70cc32a82c2f9dc490496c" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit_variants" ADD CONSTRAINT "FK_66067c1f50cd9ac35d334b42466" FOREIGN KEY ("productKitId") REFERENCES "product_kit"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit_variants" ADD CONSTRAINT "FK_05bd3738453d3fb49d724b650d7" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_kit_variants" DROP CONSTRAINT "FK_05bd3738453d3fb49d724b650d7"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit_variants" DROP CONSTRAINT "FK_66067c1f50cd9ac35d334b42466"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" DROP CONSTRAINT "FK_47f5b70cc32a82c2f9dc490496c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_05bd3738453d3fb49d724b650d"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_66067c1f50cd9ac35d334b4246"`, undefined);
        await queryRunner.query(`DROP TABLE "product_kit_variants"`, undefined);
        await queryRunner.query(`DROP TABLE "product_kit"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."product_kit_discounttype_enum"`, undefined);
   }

}
