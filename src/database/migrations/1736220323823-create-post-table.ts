import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1736220323823 implements MigrationInterface {
  name = 'CreatePostTable1736220323823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_a57841be2a748241227d7cf1aee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03"`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" text NOT NULL, "reject_reason" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" uuid, "validatorId" uuid, "specieId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "specieId"`);
    await queryRunner.query(
      `ALTER TABLE "file" DROP COLUMN "characteristicId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_d09ee5ee0828ce7edf0a5f737e4" FOREIGN KEY ("validatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_bb1177e2533171785cef4f84946" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_bb1177e2533171785cef4f84946"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_d09ee5ee0828ce7edf0a5f737e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "characteristicId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "file" ADD "specieId" integer`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_a57841be2a748241227d7cf1aee" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
