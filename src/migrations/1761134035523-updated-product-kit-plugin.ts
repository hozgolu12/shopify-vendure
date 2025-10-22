import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedProductKitPlugin1761134035523 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_kit" ADD "productKitPrice" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" ADD "primaryProductId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" ADD CONSTRAINT "FK_7482332418a62b055104ae0717a" FOREIGN KEY ("primaryProductId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_kit" DROP CONSTRAINT "FK_7482332418a62b055104ae0717a"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" DROP COLUMN "primaryProductId"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_kit" DROP COLUMN "productKitPrice"`, undefined);
   }

}
