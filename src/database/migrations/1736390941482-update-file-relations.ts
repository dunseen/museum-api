import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFileRelations1736390941482 implements MigrationInterface {
  name = 'UpdateFileRelations1736390941482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "specieId" integer`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "characteristicId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_a57841be2a748241227d7cf1aee" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_a57841be2a748241227d7cf1aee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP COLUMN "characteristicId"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "specieId"`);
  }
}
