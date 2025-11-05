import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDraftCharacteristicTable1761414213794
  implements MigrationInterface
{
  name = 'UpdateDraftCharacteristicTable1761414213794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "characteristic_draft" DROP COLUMN "filePaths"`,
    );
    await queryRunner.query(
      `ALTER TABLE "characteristic_draft" DROP COLUMN "filesToDelete"`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "characteristic_draft" ADD "filesToDelete" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "characteristic_draft" ADD "filePaths" jsonb`,
    );
  }
}
