import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedUnusedPlugin1759472684245 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsCompany" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsLocation" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsWorkspace" jsonb`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsWorkspace"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsLocation"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsCompany"`, undefined);
   }

}
