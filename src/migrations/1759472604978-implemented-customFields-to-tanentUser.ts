import {MigrationInterface, QueryRunner} from "typeorm";

export class ImplementedCustomFieldsToTanentUser1759472604978 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "test_custom_fields_translation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "languageCode" character varying NOT NULL, "localizedName" character varying NOT NULL, "id" SERIAL NOT NULL, "baseId" integer, CONSTRAINT "PK_3acf9a8dc0073df3f64bffc8174" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8e47f953eb6057a1934c73749b" ON "test_custom_fields_translation" ("baseId") `, undefined);
        await queryRunner.query(`CREATE TABLE "test_custom_fields" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_b98743d2f7d07ca59c316a77167" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsCompany" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsLocation" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" ADD "customFieldsWorkspace" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "test_custom_fields_translation" ADD CONSTRAINT "FK_8e47f953eb6057a1934c73749b3" FOREIGN KEY ("baseId") REFERENCES "test_custom_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "test_custom_fields_translation" DROP CONSTRAINT "FK_8e47f953eb6057a1934c73749b3"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsWorkspace"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsLocation"`, undefined);
        await queryRunner.query(`ALTER TABLE "tenant_user" DROP COLUMN "customFieldsCompany"`, undefined);
        await queryRunner.query(`DROP TABLE "test_custom_fields"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e47f953eb6057a1934c73749b"`, undefined);
        await queryRunner.query(`DROP TABLE "test_custom_fields_translation"`, undefined);
   }

}
