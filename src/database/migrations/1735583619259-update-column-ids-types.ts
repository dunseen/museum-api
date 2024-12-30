import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnIdsTypes1735583619259 implements MigrationInterface {
  name = 'UpdateColumnIdsTypes1735583619259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "hierarchy_id_seq" OWNED BY "hierarchy"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hierarchy" ALTER COLUMN "id" SET DEFAULT nextval('"hierarchy_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "taxon_id_seq" OWNED BY "taxon"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ALTER COLUMN "id" SET DEFAULT nextval('"taxon_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "status_id_seq" OWNED BY "status"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ALTER COLUMN "id" SET DEFAULT nextval('"status_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "role_id_seq" OWNED BY "role"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT nextval('"role_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "PK_ae8a78cf6f1cffa5f4cfa7d58f4"`,
    );
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "specie" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "PK_ae8a78cf6f1cffa5f4cfa7d58f4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57" FOREIGN KEY ("hierarchyId") REFERENCES "hierarchy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a" FOREIGN KEY ("parentId") REFERENCES "taxon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" DROP CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" DROP CONSTRAINT "PK_ae8a78cf6f1cffa5f4cfa7d58f4"`,
    );
    await queryRunner.query(`ALTER TABLE "specie" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "specie" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie" ADD CONSTRAINT "PK_ae8a78cf6f1cffa5f4cfa7d58f4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "role_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "status" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "status_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "taxon_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_3e2532a0bbbf5584e0393bb117a" FOREIGN KEY ("parentId") REFERENCES "taxon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hierarchy" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "hierarchy_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "taxon" ADD CONSTRAINT "FK_e1c97b13e83553a0dcbaba5fc57" FOREIGN KEY ("hierarchyId") REFERENCES "hierarchy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
