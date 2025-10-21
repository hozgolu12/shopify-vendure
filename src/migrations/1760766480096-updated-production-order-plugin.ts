import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedProductionOrderPlugin1760766480096 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_7cf733413f92d6e9cc452607fd6"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "updatedBy"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "groupId"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "groupTitle"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "vendureOrderId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "vendureItemId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "productKitId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "productKitTitle" text`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "stage" character varying NOT NULL DEFAULT 'not-started'`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "designId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_3b9d8fbaa09f36d72f67e7b652d" FOREIGN KEY ("vendureOrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_d43e029292b81ce3cbbe299c6aa" FOREIGN KEY ("productKitId") REFERENCES "product_kit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_d43e029292b81ce3cbbe299c6aa"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_3b9d8fbaa09f36d72f67e7b652d"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "designId"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "stage"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "productKitTitle"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "productKitId"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "vendureItemId"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "vendureOrderId"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "groupTitle" text`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "groupId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD "updatedBy" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_7cf733413f92d6e9cc452607fd6" FOREIGN KEY ("updatedBy") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
