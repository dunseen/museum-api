import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToSpecie1737303038350 implements MigrationInterface {
  name = 'AddDescriptionToSpecie1737303038350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "description" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6cb6fcbc2fca6bba219216fe43" ON "specie" ("description") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6cb6fcbc2fca6bba219216fe43"`,
    );
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "description"`);
  }
}
