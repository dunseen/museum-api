import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlColumnToFile1740886116201 implements MigrationInterface {
  name = 'AddUrlColumnToFile1740886116201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "url" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "url"`);
  }
}
