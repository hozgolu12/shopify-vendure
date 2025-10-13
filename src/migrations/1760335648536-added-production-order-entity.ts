import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedProductionOrderEntity1760335648536 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."production_order_ordertype_enum" AS ENUM('SINGLE', 'BULK', 'CUSTOM')`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."production_order_status_enum" AS ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'READY_FOR_QC', 'COMPLETED', 'CANCELLED', 'ON_HOLD')`, undefined);
        await queryRunner.query(`CREATE TABLE "production_order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "tenantId" integer NOT NULL, "workspaceId" integer NOT NULL, "customerId" integer NOT NULL, "orderType" "public"."production_order_ordertype_enum" NOT NULL DEFAULT 'SINGLE', "groupId" integer, "groupTitle" text, "itemCode" text NOT NULL, "itemTitle" text NOT NULL, "status" "public"."production_order_status_enum" NOT NULL DEFAULT 'DRAFT', "itemConfig" text NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, CONSTRAINT "PK_e90e1070bf38dd156947f1322b7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_bca44fb57c666b2d787c19b45ff" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_620aeff0028a69d500810696f4c" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_4bbd8c096fdcaa42e4174475107" FOREIGN KEY ("createdBy") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_7cf733413f92d6e9cc452607fd6" FOREIGN KEY ("updatedBy") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_7cf733413f92d6e9cc452607fd6"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_4bbd8c096fdcaa42e4174475107"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_620aeff0028a69d500810696f4c"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_bca44fb57c666b2d787c19b45ff"`, undefined);
        await queryRunner.query(`DROP TABLE "production_order"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_ordertype_enum"`, undefined);
   }

}
