import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTenantUser1759302933829 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "tenant_user" ("id" SERIAL NOT NULL, "betterAuthId" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "companyName" character varying, "companyType" character varying, "role" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3e19758bdf4e2c62318a629929" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7865f36550755b86fd324844ff" ON "tenant_user" ("betterAuthId") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_80e5f0171fb2f6ac7196005f30" ON "tenant_user" ("email") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_80e5f0171fb2f6ac7196005f30"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_7865f36550755b86fd324844ff"`, undefined);
        await queryRunner.query(`DROP TABLE "tenant_user"`, undefined);
   }

}
