import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveApprovedByFromChangeLog1751672705534 implements MigrationInterface {
  name = 'RemoveApprovedByFromChangeLog1751672705534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_log" DROP CONSTRAINT "FK_95c6e2d5484ae3244f063d5ecb3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95c6e2d5484ae3244f063d5ecb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_log" DROP COLUMN "approvedById"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_log" ADD "approvedById" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95c6e2d5484ae3244f063d5ecb" ON "change_log" ("approvedById") `,
    );
    await queryRunner.query(
      `ALTER TABLE "change_log" ADD CONSTRAINT "FK_95c6e2d5484ae3244f063d5ecb3" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
