import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFileTable1761401825726 implements MigrationInterface {
  name = 'UpdateFileTable1761401825726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_change_request_draft_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
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
    await queryRunner.query(
      `CREATE INDEX "IDX_fa267d0b4d28f1cfddd239dce0" ON "file" ("specieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a57841be2a748241227d7cf1ae" ON "file" ("characteristicId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30b027c292ea1dfe78caeabfc8" ON "file" ("changeRequestId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30b027c292ea1dfe78caeabfc8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a57841be2a748241227d7cf1ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa267d0b4d28f1cfddd239dce0"`,
    );
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
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_change_request_draft_id" ON "change_request" ("draftId") `,
    );
  }
}
