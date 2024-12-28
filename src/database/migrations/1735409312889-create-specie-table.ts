import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpecieTable1735409312889 implements MigrationInterface {
  name = 'CreateSpecieTable1735409312889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "specie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scientificName" character varying(255) NOT NULL, "commonName" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ae8a78cf6f1cffa5f4cfa7d58f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_74019858e640f68ebf57307981" ON "specie" ("scientificName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db81b7584004adcc9fb534b418" ON "specie" ("commonName") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db81b7584004adcc9fb534b418"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_74019858e640f68ebf57307981"`,
    );
    await queryRunner.query(`DROP TABLE "specie"`);
  }
}
