import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedProductOrderPluginCommentedProductKitJoin1762514163373 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" DROP CONSTRAINT "FK_d43e029292b81ce3cbbe299c6aa"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order" ADD CONSTRAINT "FK_d43e029292b81ce3cbbe299c6aa" FOREIGN KEY ("productKitId") REFERENCES "product_kit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
