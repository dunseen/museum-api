import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaxonHiearchyTables1735496158851
  implements MigrationInterface
{
  name = 'CreateTaxonHiearchyTables1735496158851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hierarchy" ("id" integer NOT NULL, "name" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a21e2eaec4474624e39db5ca52b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a00c003aaf5e7ae99145148f52" ON "hierarchy" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "taxon" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hierarchyId" integer, "parentId" integer, CONSTRAINT "PK_afc90a12dfbc079feefda95a7b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_baad59ee5a7ff46accf02eea08" ON "taxon" ("name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57" FOREIGN KEY ("hierarchyId") REFERENCES "hierarchy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a" FOREIGN KEY ("parentId") REFERENCES "taxon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_baad59ee5a7ff46accf02eea08"`,
    );
    await queryRunner.query(`DROP TABLE "taxon"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a00c003aaf5e7ae99145148f52"`,
    );
    await queryRunner.query(`DROP TABLE "hierarchy"`);
  }
}
