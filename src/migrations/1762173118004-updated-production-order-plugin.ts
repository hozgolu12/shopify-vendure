import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedProductionOrderPlugin1762173118004 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" ADD "createdByMongoId" character varying`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" DROP COLUMN "createdByMongoId"`, undefined);
   }

}
