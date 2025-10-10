import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedProductTypeInCustomFields1760097482996 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "customFieldsTest" TO "customFieldsProducttype"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsProducttype"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsProducttype" jsonb`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsProducttype"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsProducttype" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "customFieldsProducttype" TO "customFieldsTest"`, undefined);
   }

}
