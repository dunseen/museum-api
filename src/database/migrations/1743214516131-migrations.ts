import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743214516131 implements MigrationInterface {
  name = 'Migrations1743214516131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "location" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "specie" ADD "lat" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "specie" ADD "long" numeric NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "collectedAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "specie" ADD "stateId" integer`);
    await queryRunner.query(`ALTER TABLE "specie" ADD "cityId" integer`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "FK_32bdd26c7f42d420cb1988ac4eb" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "FK_b56b505f230a38c56593147cda2" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "FK_b56b505f230a38c56593147cda2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "FK_32bdd26c7f42d420cb1988ac4eb"`,
    );
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "cityId"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "stateId"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "collectedAt"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "long"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "location"`);
  }
}
