import {MigrationInterface, QueryRunner} from "typeorm";

export class ChannelCustomFields1759140452538 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsProductkits" jsonb`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsOrderkits" jsonb`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsOrderkits"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsProductkits"`, undefined);
   }

}
