import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCharacteristicTables1735581681468
  implements MigrationInterface
{
  name = 'CreateCharacteristicTables1735581681468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "characteristic_type" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_11a136a53fb9ff2891c81f9123b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad642360c6031a68954956a7ec" ON "characteristic_type" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "characteristic" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "typeId" integer, CONSTRAINT "PK_88f998ec743440a5c758e08ece4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34f8a8cba6c9eaf5a5062adc67" ON "characteristic" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afdd607f98121bb54fc471c6a8" ON "characteristic" ("description") `,
    );
    await queryRunner.query(
      `ALTER TABLE "characteristic" ADD CONSTRAINT "FK_f7ab9aa08460fc9b39b23c902e2" FOREIGN KEY ("typeId") REFERENCES "characteristic_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "characteristic" DROP CONSTRAINT "FK_f7ab9aa08460fc9b39b23c902e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_afdd607f98121bb54fc471c6a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34f8a8cba6c9eaf5a5062adc67"`,
    );
    await queryRunner.query(`DROP TABLE "characteristic"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad642360c6031a68954956a7ec"`,
    );
    await queryRunner.query(`DROP TABLE "characteristic_type"`);
  }
}
