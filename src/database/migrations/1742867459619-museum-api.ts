import { MigrationInterface, QueryRunner } from 'typeorm';

export class MuseumApi1742867459619 implements MigrationInterface {
  name = 'MuseumApi1742867459619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" ALTER COLUMN "commonName" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie" ALTER COLUMN "commonName" SET NOT NULL`,
    );
  }
}
