import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTimesheetPlugin1761550707231 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."artisan_task_timesheet_ratetype_enum" AS ENUM('hourly', 'daily')`, undefined);
        await queryRunner.query(`CREATE TABLE "artisan_task_timesheet" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "tenantId" integer NOT NULL, "workspaceId" integer NOT NULL, "artisanId" integer NOT NULL, "startDate" date NOT NULL, "endDate" date, "timeSpent" TIME, "rate" numeric(10,2) NOT NULL DEFAULT '0', "rateType" "public"."artisan_task_timesheet_ratetype_enum" NOT NULL DEFAULT 'hourly', "productionOrderId" integer, "rework" boolean NOT NULL DEFAULT false, "productive" boolean NOT NULL DEFAULT true, "reason" text, "created" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, CONSTRAINT "PK_b2654c06d6da16f27f77d30ff3b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD CONSTRAINT "FK_bcad9e4a772819beadab38217fc" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD CONSTRAINT "FK_e693ea637d94dd4399ea63b5e13" FOREIGN KEY ("artisanId") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD CONSTRAINT "FK_9fb907aaa2d8bc310b07fae41f2" FOREIGN KEY ("productionOrderId") REFERENCES "production_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" ADD CONSTRAINT "FK_0d8949609e2bdd66587974412e6" FOREIGN KEY ("createdBy") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP CONSTRAINT "FK_0d8949609e2bdd66587974412e6"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP CONSTRAINT "FK_9fb907aaa2d8bc310b07fae41f2"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP CONSTRAINT "FK_e693ea637d94dd4399ea63b5e13"`, undefined);
        await queryRunner.query(`ALTER TABLE "artisan_task_timesheet" DROP CONSTRAINT "FK_bcad9e4a772819beadab38217fc"`, undefined);
        await queryRunner.query(`DROP TABLE "artisan_task_timesheet"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."artisan_task_timesheet_ratetype_enum"`, undefined);
   }

}
