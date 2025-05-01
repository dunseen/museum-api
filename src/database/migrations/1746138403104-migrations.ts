import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746138403104 implements MigrationInterface {
  name = 'Migrations1746138403104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS postgis;
      `);

    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "long"`);
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "collectLocation" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "geoLocation" geography(Point,4326) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "geoLocation"`);
    await queryRunner.query(
      `ALTER TABLE "specie" DROP COLUMN "collectLocation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "location" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "specie" ADD "long" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "specie" ADD "lat" numeric NOT NULL`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS postgis`);
  }
}
