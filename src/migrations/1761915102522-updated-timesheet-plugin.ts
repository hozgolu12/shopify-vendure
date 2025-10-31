import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedTimesheetPlugin1761915102522 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsProductkits"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsOrderkits"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "tenantMongoId" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "workspaceMongoId" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "artisanMongoId" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "createdByMongoId" character varying NOT NULL`, undefined);
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
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "createdByMongoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "artisanMongoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "workspaceMongoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "tenantMongoId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsOrderkits" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsProductkits" jsonb`, undefined);
   }

}
