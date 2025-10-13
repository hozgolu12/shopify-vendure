import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedItemConfigToProduct1760349302853 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsItemconfig" text`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsItemconfig"`, undefined);
   }

}
