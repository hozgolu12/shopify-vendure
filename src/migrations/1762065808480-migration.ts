import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1762065808480 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order_task" RENAME COLUMN "tenantMongodbId" TO "tenantMongoId"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order_task" RENAME COLUMN "tenantMongoId" TO "tenantMongodbId"`, undefined);
   }

}
