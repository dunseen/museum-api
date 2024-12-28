import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableIdsType1735395977645 implements MigrationInterface {
  name = 'UpdateTableIdsType1735395977645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`,
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "userId" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`,
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "species"`);
  }
}
