import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChangeRequestToPost1757205000000 implements MigrationInterface {
  name = 'AddChangeRequestToPost1757205000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "changeRequestId" integer`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_post_change_request" FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_post_change_request"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "changeRequestId"`);
  }
}
