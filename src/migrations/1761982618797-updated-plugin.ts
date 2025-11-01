import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedPlugin1761982618797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "channel" DROP COLUMN "customFieldsProductkits"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "channel" DROP COLUMN "customFieldsOrderkits"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order" ADD "tenantMongoId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order" ADD "workspaceMongoId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ADD "tenantMongoId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ADD "workspaceMongoId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ADD "assigneesMongoId" text`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ADD "supervisorMongoId" character varying`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ADD "createdByMongoId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "tenantMongoId" character varying`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "workspaceMongoId" character varying`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "artisanMongoId" character varying`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "createdByMongoId" character varying`,
      undefined
    );
    await queryRunner.query(
      `ALTER TYPE "public"."production_order_task_status_enum" RENAME TO "production_order_task_status_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "public"."production_order_task_status_enum" AS ENUM('to_do', 'in_progress', 'on_hold', 'completed')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" DROP DEFAULT`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" TYPE "public"."production_order_task_status_enum" USING "status"::"text"::"public"."production_order_task_status_enum"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" SET DEFAULT 'to_do'`,
      undefined
    );
    await queryRunner.query(
      `DROP TYPE "public"."production_order_task_status_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "startDate"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "startDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "endDate"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "endDate" TIMESTAMP WITH TIME ZONE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "endDate"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "endDate" date`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "startDate"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" ADD "startDate" date NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "public"."production_order_task_status_enum_old" AS ENUM('to do', 'in_progress', 'on hold', 'done')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" DROP DEFAULT`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" TYPE "public"."production_order_task_status_enum_old" USING "status"::"text"::"public"."production_order_task_status_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" ALTER COLUMN "status" SET DEFAULT 'to do'`,
      undefined
    );
    await queryRunner.query(
      `DROP TYPE "public"."production_order_task_status_enum"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TYPE "public"."production_order_task_status_enum_old" RENAME TO "production_order_task_status_enum"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "createdByMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "artisanMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "workspaceMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "artisan_task_timesheet" DROP COLUMN "tenantMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" DROP COLUMN "createdByMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" DROP COLUMN "supervisorMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" DROP COLUMN "assigneesMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" DROP COLUMN "workspaceMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order_task" DROP COLUMN "tenantMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order" DROP COLUMN "workspaceMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "production_order" DROP COLUMN "tenantMongoId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD "customFieldsOrderkits" jsonb`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD "customFieldsProductkits" jsonb`,
      undefined
    );
  }
}
