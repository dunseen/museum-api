import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748641831236 implements MigrationInterface {
  name = 'Migrations1748641831236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."specialist_type_enum" AS ENUM('collector', 'determinator')`,
    );
    await queryRunner.query(
      `CREATE TABLE "specialist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "type" "public"."specialist_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_fbedbcfc4942a762032ec1cb7f8" UNIQUE ("name"), CONSTRAINT "PK_461a4a90df7daf980d8b79bc3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbedbcfc4942a762032ec1cb7f" ON "specialist" ("name") `,
    );
    await queryRunner.query(`ALTER TABLE "specie" ADD "collectorId" uuid`);
    await queryRunner.query(`ALTER TABLE "specie" ADD "determinatorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "FK_132452b6a02f8f4267348190872" FOREIGN KEY ("collectorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "FK_9b874b488b9e2a5bfc52f592c17" FOREIGN KEY ("determinatorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "FK_9b874b488b9e2a5bfc52f592c17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "FK_132452b6a02f8f4267348190872"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" DROP COLUMN "determinatorId"`,
    );
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "collectorId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fbedbcfc4942a762032ec1cb7f"`,
    );
    await queryRunner.query(`DROP TABLE "specialist"`);
    await queryRunner.query(`DROP TYPE "public"."specialist_type_enum"`);
  }
}
