import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743831947561 implements MigrationInterface {
  name = 'Migrations1743831947561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_bb1177e2533171785cef4f84946"`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_specie" ("postId" uuid NOT NULL, "specieId" integer NOT NULL, CONSTRAINT "PK_e514b5b0a51591c61e7ec50c484" PRIMARY KEY ("postId", "specieId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c85fbbc1ab4c8b0acd6054ba02" ON "post_specie" ("postId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_acccfb914526a5b33320344f23" ON "post_specie" ("specieId") `,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "specieId"`);
    await queryRunner.query(
      `ALTER TABLE "post_specie" ADD CONSTRAINT "FK_c85fbbc1ab4c8b0acd6054ba021" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_specie" ADD CONSTRAINT "FK_acccfb914526a5b33320344f23f" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_specie" DROP CONSTRAINT "FK_acccfb914526a5b33320344f23f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_specie" DROP CONSTRAINT "FK_c85fbbc1ab4c8b0acd6054ba021"`,
    );
    await queryRunner.query(`ALTER TABLE "post" ADD "specieId" integer`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_acccfb914526a5b33320344f23"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c85fbbc1ab4c8b0acd6054ba02"`,
    );
    await queryRunner.query(`DROP TABLE "post_specie"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_bb1177e2533171785cef4f84946" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
