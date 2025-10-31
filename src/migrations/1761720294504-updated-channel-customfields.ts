import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedChannelCustomfields1761720294504 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsProductkits"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsOrderkits"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "startDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "startDate" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "endDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "endDate" TIMESTAMP WITH TIME ZONE`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "endDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "endDate" date`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "startDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "startDate" date NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsOrderkits" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsProductkits" jsonb`, undefined);
   }

}
