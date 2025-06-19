import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748645784270 implements MigrationInterface {
  name = 'Migrations1748645784270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "determinatedAt" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" DROP COLUMN "determinatedAt"`,
    );
  }
}
