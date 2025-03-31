import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743367307954 implements MigrationInterface {
  name = 'Migrations1743367307954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_afdd607f98121bb54fc471c6a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "characteristic" DROP COLUMN "description"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "characteristic" ADD "description" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afdd607f98121bb54fc471c6a8" ON "characteristic" ("description") `,
    );
  }
}
