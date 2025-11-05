import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1757190044474 implements MigrationInterface {
  name = 'Migrations1757190044474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "approved" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "approved"`);
  }
}
