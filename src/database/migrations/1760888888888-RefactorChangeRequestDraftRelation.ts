import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorChangeRequestDraftRelation1760888888888
  implements MigrationInterface
{
  name = 'RefactorChangeRequestDraftRelation1760888888888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add draftId column to change_request
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD COLUMN "draftId" integer`,
    );

    // Step 2: Create index on draftId for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_change_request_draft_id" ON "change_request" ("draftId")`,
    );

    // Step 3: Migrate data from specie_draft.changeRequestId to change_request.draftId
    // For each specie_draft, update the corresponding change_request
    await queryRunner.query(`
      UPDATE "change_request" cr
      SET "draftId" = sd.id
      FROM "specie_draft" sd
      WHERE sd."changeRequestId" = cr.id
        AND cr."entityType" = 'specie'
    `);

    // Step 4: Drop the foreign key constraint from specie_draft
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT IF EXISTS "FK_specie_draft_change_request"`,
    );

    // Step 5: Drop the changeRequestId column from specie_draft
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP COLUMN "changeRequestId"`,
    );

    // Note: We don't add a foreign key constraint from change_request.draftId to specie_draft.id
    // because draftId is polymorphic and can reference different draft tables based on entityType
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add back changeRequestId column to specie_draft
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD COLUMN "changeRequestId" integer`,
    );

    // Step 2: Migrate data back from change_request.draftId to specie_draft.changeRequestId
    await queryRunner.query(`
      UPDATE "specie_draft" sd
      SET "changeRequestId" = cr.id
      FROM "change_request" cr
      WHERE cr."draftId" = sd.id
        AND cr."entityType" = 'specie'
    `);

    // Step 3: Make changeRequestId NOT NULL and add foreign key
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ALTER COLUMN "changeRequestId" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_change_request" 
       FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") 
       ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Step 4: Drop index and draftId column from change_request
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_change_request_draft_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "change_request" DROP COLUMN "draftId"`,
    );
  }
}
