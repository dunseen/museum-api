import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1751669951822 implements MigrationInterface {
  name = 'Migrations1751669951822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "change_log" ("id" SERIAL NOT NULL, "tableName" character varying NOT NULL, "action" character varying NOT NULL, "oldValue" jsonb, "newValue" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "changedById" uuid, "approvedById" uuid, CONSTRAINT "PK_d00462cfb97b72c95357d559136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d339722079391abbc649608412" ON "change_log" ("changedById") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95c6e2d5484ae3244f063d5ecb" ON "change_log" ("approvedById") `,
    );
    await queryRunner.query(
      `ALTER TABLE "change_log" ADD CONSTRAINT "FK_d339722079391abbc649608412a" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_log" ADD CONSTRAINT "FK_95c6e2d5484ae3244f063d5ecb3" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_log" DROP CONSTRAINT "FK_95c6e2d5484ae3244f063d5ecb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_log" DROP CONSTRAINT "FK_d339722079391abbc649608412a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95c6e2d5484ae3244f063d5ecb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d339722079391abbc649608412"`,
    );
    await queryRunner.query(`DROP TABLE "change_log"`);
  }
}
