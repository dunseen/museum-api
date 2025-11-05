import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCharacteristicDraftEntity1760885738990
  implements MigrationInterface
{
  name = 'CreateCharacteristicDraftEntity1760885738990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "characteristic_draft" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "filePaths" jsonb, "filesToDelete" jsonb, "type_id" integer, CONSTRAINT "PK_01bb8eba7970219e56a3f6a96f4" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "characteristic_draft" ADD CONSTRAINT "FK_2afdf1175a888b16740b358124d" FOREIGN KEY ("type_id") REFERENCES "characteristic_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "characteristic_draft" DROP CONSTRAINT "FK_2afdf1175a888b16740b358124d"`,
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
    await queryRunner.query(`DROP TABLE "characteristic_draft"`);
  }
}
