import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaxonDraft1761494109548 implements MigrationInterface {
  name = 'CreateTaxonDraft1761494109548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taxon_draft" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "hierarchy_id" integer, "parent_id" integer, CONSTRAINT "PK_bd84691e83c833e29a6c12be833" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "taxon_draft_characteristic" ("taxonDraftId" integer NOT NULL, "characteristicId" integer NOT NULL, CONSTRAINT "PK_b5c75f76c64976a06cece576cbd" PRIMARY KEY ("taxonDraftId", "characteristicId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c4d88a672c684b1edac072590" ON "taxon_draft_characteristic" ("taxonDraftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f733a509f0b8d4a801f6a53a67" ON "taxon_draft_characteristic" ("characteristicId") `,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_action_enum" RENAME TO "change_request_action_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_action_enum" AS ENUM('create', 'update', 'delete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "action" TYPE "public"."change_request_action_enum" USING "action"::"text"::"public"."change_request_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."change_request_action_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_status_enum" RENAME TO "change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_status_enum" AS ENUM('pending', 'approved', 'rejected', 'withdrawn')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" TYPE "public"."change_request_status_enum" USING "status"::"text"::"public"."change_request_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft" ADD CONSTRAINT "FK_89493419c159366ea62de3442c8" FOREIGN KEY ("hierarchy_id") REFERENCES "hierarchy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft" ADD CONSTRAINT "FK_ff783f396d4beda810150ea4351" FOREIGN KEY ("parent_id") REFERENCES "taxon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft_characteristic" ADD CONSTRAINT "FK_3c4d88a672c684b1edac072590f" FOREIGN KEY ("taxonDraftId") REFERENCES "taxon_draft"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft_characteristic" ADD CONSTRAINT "FK_f733a509f0b8d4a801f6a53a67d" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxon_draft_characteristic" DROP CONSTRAINT "FK_f733a509f0b8d4a801f6a53a67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft_characteristic" DROP CONSTRAINT "FK_3c4d88a672c684b1edac072590f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft" DROP CONSTRAINT "FK_ff783f396d4beda810150ea4351"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_draft" DROP CONSTRAINT "FK_89493419c159366ea62de3442c8"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_status_enum_old" AS ENUM('pending', 'approved', 'rejected', 'withdrawn')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" TYPE "public"."change_request_status_enum_old" USING "status"::"text"::"public"."change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."change_request_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_status_enum_old" RENAME TO "change_request_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_action_enum_old" AS ENUM('create', 'update', 'delete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "action" TYPE "public"."change_request_action_enum_old" USING "action"::"text"::"public"."change_request_action_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."change_request_action_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_action_enum_old" RENAME TO "change_request_action_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f733a509f0b8d4a801f6a53a67"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c4d88a672c684b1edac072590"`,
    );
    await queryRunner.query(`DROP TABLE "taxon_draft_characteristic"`);
    await queryRunner.query(`DROP TABLE "taxon_draft"`);
  }
}
