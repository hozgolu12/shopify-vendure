import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSubFacetCustomField1762928373535 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "facet_value" ADD "customFieldsSubfacet" text`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "facet_value" DROP COLUMN "customFieldsSubfacet"`, undefined);
   }

}
