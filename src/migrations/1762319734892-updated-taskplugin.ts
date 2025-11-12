import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedTaskplugin1762319734892 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD "workstation" character varying`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP COLUMN "workstation"`, undefined);
   }

}
