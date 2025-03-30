import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743365888334 implements MigrationInterface {
  name = 'Migrations1743365888334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "characteristic" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "taxon" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taxon" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "characteristic" DROP COLUMN "deletedAt"`,
    );
  }
}
