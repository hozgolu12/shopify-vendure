import {MigrationInterface, QueryRunner} from "typeorm";

export class CheckingMeasurementIssue1762771064466 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFieldsMeasurements"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFieldsMeasurements" text`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFieldsMeasurements"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFieldsMeasurements" jsonb`, undefined);
   }

}
