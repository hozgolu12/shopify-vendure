import {MigrationInterface, QueryRunner} from "typeorm";

export class CompanyNameConflictSolved1759832594045 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tenant_company_location" DROP CONSTRAINT "FK_84840874d663319429b4a99a282"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP CONSTRAINT "FK_d476ce655028bcccb073ca89eca"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_company_location" ADD CONSTRAINT "FK_1bb300cde4800326109928e957f" FOREIGN KEY ("companyId") REFERENCES "tenant_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD CONSTRAINT "FK_5107d6663f664832fe6a5e7db1a" FOREIGN KEY ("companyId") REFERENCES "tenant_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP CONSTRAINT "FK_5107d6663f664832fe6a5e7db1a"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_company_location" DROP CONSTRAINT "FK_1bb300cde4800326109928e957f"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD CONSTRAINT "FK_d476ce655028bcccb073ca89eca" FOREIGN KEY ("companyId") REFERENCES "tenant_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_company_location" ADD CONSTRAINT "FK_84840874d663319429b4a99a282" FOREIGN KEY ("companyId") REFERENCES "tenant_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
