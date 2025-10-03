import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPlugins1759489489632 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "silhouette_category" ("id" SERIAL NOT NULL, "silhouetteId" character varying NOT NULL, "name" character varying NOT NULL, "enabled" boolean NOT NULL, "silhouetteTypes" text NOT NULL, "inventoryId" integer, CONSTRAINT "PK_c9a7e644d1bd04081e08b6f5eb1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "modifier" ("id" SERIAL NOT NULL, "modifierId" character varying NOT NULL, "groupName" character varying NOT NULL, "enabled" boolean NOT NULL, "modifiers" text NOT NULL, "inventoryId" integer, CONSTRAINT "PK_30c20db2bc7a8c2318b4db0dfc0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "attribute" ("id" SERIAL NOT NULL, "attributeId" character varying NOT NULL, "groupName" character varying NOT NULL, "enabled" boolean NOT NULL, "values" text NOT NULL, "inventoryId" integer, CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "embellishment" ("id" SERIAL NOT NULL, "embellishmentId" character varying NOT NULL, "groupName" character varying NOT NULL, "enabled" boolean NOT NULL, "values" text NOT NULL, "code" character varying, "inventoryId" integer, CONSTRAINT "PK_e029c6f80f9b90439306df055b7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "motif" ("id" SERIAL NOT NULL, "motifId" character varying NOT NULL, "groupName" character varying NOT NULL, "enabled" boolean NOT NULL, "values" text NOT NULL, "code" character varying, "inventoryId" integer, CONSTRAINT "PK_0e9766456144001cab53e0b237c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "trim_closure" ("id" SERIAL NOT NULL, "trimClosureId" character varying NOT NULL, "groupName" character varying NOT NULL, "enabled" boolean NOT NULL, "values" text NOT NULL, "inventoryId" integer, CONSTRAINT "PK_973643e4d117dc60cd9aaa2d1c2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "regular_attribute" ("id" SERIAL NOT NULL, "regularAttributeId" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "enabled" boolean NOT NULL, "properties" text NOT NULL, "group" character varying, "parent" character varying, "abbreviation" character varying, "inventoryId" integer, CONSTRAINT "PK_c96562c94eb7253ce768e977b3a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "item_code" ("id" SERIAL NOT NULL, "itemCodeAttributes" text NOT NULL, "itemNameAttributes" text NOT NULL, "delimiter" character varying NOT NULL, "itemCode" character varying NOT NULL, "itemName" character varying NOT NULL, "inventoryId" integer, CONSTRAINT "PK_f28aae3697811a4da5ec0a7e601" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "tenant_inventory" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "userId" integer NOT NULL, "workspaceId" character varying, "productRegions" text NOT NULL, "itemCodeId" integer, CONSTRAINT "REL_82f1a9bce2683fc56a6ab48012" UNIQUE ("itemCodeId"), CONSTRAINT "PK_16f5cfba01291e36b5aa9d59873" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "measurement_field" ("id" SERIAL NOT NULL, "fieldName" character varying NOT NULL, "selectedValues" text NOT NULL, "workspaceId" integer, CONSTRAINT "PK_61f6039fd3801fc0cfc9dc19d9b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "workspace" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "userId" integer NOT NULL, "organizationId" character varying, "workspaceName" character varying NOT NULL, "productLine" character varying NOT NULL, "statuses" text NOT NULL, "workstations" text NOT NULL, "sizeSystems" text NOT NULL, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsWorkspace"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsCompany"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsLocation"`, undefined);
        await queryRunner.query(`ALTER TABLE "silhouette_category" ADD CONSTRAINT "FK_32de9a366938f6cf0b16cb607b8" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "modifier" ADD CONSTRAINT "FK_ee377cdf16793c0b7568a3af177" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "attribute" ADD CONSTRAINT "FK_a718481c2caad025bf04f98790d" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "embellishment" ADD CONSTRAINT "FK_9164f2f6457cfb1e337f7dc7ae2" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "motif" ADD CONSTRAINT "FK_3dfbaa52989a773e5ac3c9e4b9d" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "trim_closure" ADD CONSTRAINT "FK_0dfc0498b603c8220960a73354d" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "regular_attribute" ADD CONSTRAINT "FK_83a661e53586e6054cc6b67aa01" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "item_code" ADD CONSTRAINT "FK_9333649022d95cde2ae7cc9f60c" FOREIGN KEY ("inventoryId") REFERENCES "tenant_inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_inventory" ADD CONSTRAINT "FK_ec6eec3bd3061e8fdd577303691" FOREIGN KEY ("userId") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_inventory" ADD CONSTRAINT "FK_82f1a9bce2683fc56a6ab48012f" FOREIGN KEY ("itemCodeId") REFERENCES "item_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "measurement_field" ADD CONSTRAINT "FK_0fc27fc2e77150a10cbd3196b2c" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_b48532fc84800d41cfee110682c" FOREIGN KEY ("userId") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_b48532fc84800d41cfee110682c"`, undefined);
        await queryRunner.query(`ALTER TABLE "measurement_field" DROP CONSTRAINT "FK_0fc27fc2e77150a10cbd3196b2c"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_inventory" DROP CONSTRAINT "FK_82f1a9bce2683fc56a6ab48012f"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_inventory" DROP CONSTRAINT "FK_ec6eec3bd3061e8fdd577303691"`, undefined);
        await queryRunner.query(`ALTER TABLE "item_code" DROP CONSTRAINT "FK_9333649022d95cde2ae7cc9f60c"`, undefined);
        await queryRunner.query(`ALTER TABLE "regular_attribute" DROP CONSTRAINT "FK_83a661e53586e6054cc6b67aa01"`, undefined);
        await queryRunner.query(`ALTER TABLE "trim_closure" DROP CONSTRAINT "FK_0dfc0498b603c8220960a73354d"`, undefined);
        await queryRunner.query(`ALTER TABLE "motif" DROP CONSTRAINT "FK_3dfbaa52989a773e5ac3c9e4b9d"`, undefined);
        await queryRunner.query(`ALTER TABLE "embellishment" DROP CONSTRAINT "FK_9164f2f6457cfb1e337f7dc7ae2"`, undefined);
        await queryRunner.query(`ALTER TABLE "attribute" DROP CONSTRAINT "FK_a718481c2caad025bf04f98790d"`, undefined);
        await queryRunner.query(`ALTER TABLE "modifier" DROP CONSTRAINT "FK_ee377cdf16793c0b7568a3af177"`, undefined);
        await queryRunner.query(`ALTER TABLE "silhouette_category" DROP CONSTRAINT "FK_32de9a366938f6cf0b16cb607b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsLocation" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsCompany" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsWorkspace" jsonb`, undefined);
        await queryRunner.query(`DROP TABLE "workspace"`, undefined);
        await queryRunner.query(`DROP TABLE "measurement_field"`, undefined);
        await queryRunner.query(`DROP TABLE "tenant_inventory"`, undefined);
        await queryRunner.query(`DROP TABLE "item_code"`, undefined);
        await queryRunner.query(`DROP TABLE "regular_attribute"`, undefined);
        await queryRunner.query(`DROP TABLE "trim_closure"`, undefined);
        await queryRunner.query(`DROP TABLE "motif"`, undefined);
        await queryRunner.query(`DROP TABLE "embellishment"`, undefined);
        await queryRunner.query(`DROP TABLE "attribute"`, undefined);
        await queryRunner.query(`DROP TABLE "modifier"`, undefined);
        await queryRunner.query(`DROP TABLE "silhouette_category"`, undefined);
   }

}
