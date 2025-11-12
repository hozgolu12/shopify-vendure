import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedTimesheetPlugin1762324115373 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD "workstation" character varying`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP COLUMN "workstation"`, undefined);
   }

}
