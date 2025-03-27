import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743113469630 implements MigrationInterface {
  name = 'Migrations1743113469630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "state" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying(2) NOT NULL, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2c4aef5929860729007ac32f6" ON "state" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "stateId" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_e99de556ee56afe72154f3ed04a"`,
    );
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2c4aef5929860729007ac32f6"`,
    );
    await queryRunner.query(`DROP TABLE "state"`);
  }
}
