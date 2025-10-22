import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedProductionOrderTaskPlugin1761048844815 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."production_order_task_status_enum" AS ENUM('to do', 'in_progress', 'on hold', 'done')`, undefined);
        await queryRunner.query(`CREATE TABLE "production_order_task" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "parentId" integer, "tenantId" integer NOT NULL, "workspaceId" integer NOT NULL, "productionOrderId" integer NOT NULL, "status" "public"."production_order_task_status_enum" NOT NULL DEFAULT 'to do', "startDate" TIMESTAMP WITH TIME ZONE, "endDate" TIMESTAMP WITH TIME ZONE, "assignees" text, "supervisor" integer, "dependencies" text, "remarks" text, "createdBy" integer NOT NULL, CONSTRAINT "PK_e614a932f9ff836b1777ecd86f2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD CONSTRAINT "FK_09b99c8aae883f867ca20f2715d" FOREIGN KEY ("parentId") REFERENCES "production_order_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD CONSTRAINT "FK_9ea85dce01b038c7c7cef1942d8" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD CONSTRAINT "FK_6ccf2d8345ce842183ba30f8400" FOREIGN KEY ("productionOrderId") REFERENCES "production_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD CONSTRAINT "FK_e4d7ab111e8373aaaa122675ba8" FOREIGN KEY ("supervisor") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" ADD CONSTRAINT "FK_eeb94f15813d65e984c55be3772" FOREIGN KEY ("createdBy") REFERENCES "tenant_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP CONSTRAINT "FK_eeb94f15813d65e984c55be3772"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP CONSTRAINT "FK_e4d7ab111e8373aaaa122675ba8"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP CONSTRAINT "FK_6ccf2d8345ce842183ba30f8400"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP CONSTRAINT "FK_9ea85dce01b038c7c7cef1942d8"`, undefined);
        await queryRunner.query(`ALTER TABLE "production_order_task" DROP CONSTRAINT "FK_09b99c8aae883f867ca20f2715d"`, undefined);
        await queryRunner.query(`DROP TABLE "production_order_task"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."production_order_task_status_enum"`, undefined);
   }

}
