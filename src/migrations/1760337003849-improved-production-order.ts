import {MigrationInterface, QueryRunner} from "typeorm";

export class ImprovedProductionOrder1760337003849 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."production_order_ordertype_enum" RENAME TO "production_order_ordertype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."production_order_ordertype_enum" AS ENUM('ALTERATION', 'MADE-TO-ORDER', 'CUSTOM')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" TYPE "public"."production_order_ordertype_enum" USING "orderType"::"text"::"public"."production_order_ordertype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" SET DEFAULT 'MADE-TO-ORDER'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_ordertype_enum_old"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."production_order_ordertype_enum_old" AS ENUM('SINGLE', 'BULK', 'CUSTOM')`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" TYPE "public"."production_order_ordertype_enum_old" USING "orderType"::"text"::"public"."production_order_ordertype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order" ALTER COLUMN "orderType" SET DEFAULT 'SINGLE'`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_ordertype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."production_order_ordertype_enum_old" RENAME TO "production_order_ordertype_enum"`, undefined);
   }

}
