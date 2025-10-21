import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedProductionOrderPlugin1760767664142 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."production_order_ordertype_enum" RENAME TO "production_order_ordertype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."production_order_ordertype_enum" AS ENUM('ALTERATION', 'PRODUCTION', 'SAMPLE')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" TYPE "public"."production_order_ordertype_enum" USING "orderType"::"text"::"public"."production_order_ordertype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" SET DEFAULT 'PRODUCTION'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_ordertype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."production_order_status_enum" RENAME TO "production_order_status_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."production_order_status_enum" AS ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'READY_FOR_QC', 'COMPLETED', 'CANCELLED', 'ARCHIVED', 'ON_HOLD')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" TYPE "public"."production_order_status_enum" USING "status"::"text"::"public"."production_order_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_status_enum_old"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."production_order_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'READY_FOR_QC', 'COMPLETED', 'CANCELLED', 'ON_HOLD')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" TYPE "public"."production_order_status_enum_old" USING "status"::"text"::"public"."production_order_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."production_order_status_enum_old" RENAME TO "production_order_status_enum"`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."production_order_ordertype_enum_old" AS ENUM('ALTERATION', 'MADE-TO-ORDER', 'CUSTOM')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" TYPE "public"."production_order_ordertype_enum_old" USING "orderType"::"text"::"public"."production_order_ordertype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" SET DEFAULT 'MADE-TO-ORDER'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_ordertype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."production_order_ordertype_enum_old" RENAME TO "production_order_ordertype_enum"`, undefined);
   }

}
