import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSpecieFromDraft1760815514063 implements MigrationInterface {
  name = 'RemoveSpecieFromDraft1760815514063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_a9ea7513edf6bc1e47ebaefbf59"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_change_request_draft_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP COLUMN "specieId"`,
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
      `CREATE INDEX "IDX_4e5189db42b948311a24bce388" ON "change_request" ("draftId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4e5189db42b948311a24bce388"`,
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
      `ALTER TABLE "specie_draft" ADD "specieId" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_change_request_draft_id" ON "change_request" ("draftId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_a9ea7513edf6bc1e47ebaefbf59" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
