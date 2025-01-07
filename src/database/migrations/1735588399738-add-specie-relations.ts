import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecieRelations1735588399738 implements MigrationInterface {
  name = 'AddSpecieRelations1735588399738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "specie_taxon" ("specieId" integer NOT NULL, "taxonId" integer NOT NULL, CONSTRAINT "PK_95ff94adea37b353b5a3fc4403b" PRIMARY KEY ("specieId", "taxonId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51958d0c409b7eec19fa28204b" ON "specie_taxon" ("specieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a886ad3d4034695f3af51315d" ON "specie_taxon" ("taxonId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "specie_characteristic" ("specieId" integer NOT NULL, "characteristicId" integer NOT NULL, CONSTRAINT "PK_22db76e6a9d6d5f8e8885f20d6a" PRIMARY KEY ("specieId", "characteristicId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36bf1168e81104f73a5d274ff3" ON "specie_characteristic" ("specieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f600b4e54ab02bb3bece3ef86" ON "specie_characteristic" ("characteristicId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "taxon_characteristic" ("taxonId" integer NOT NULL, "characteristicId" integer NOT NULL, CONSTRAINT "PK_9d708054bf7a0c8a9260423aa08" PRIMARY KEY ("taxonId", "characteristicId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_795b641bfc7db02d9f219ac444" ON "taxon_characteristic" ("taxonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36a0202a5d607d8e338abd3687" ON "taxon_characteristic" ("characteristicId") `,
    );
    await queryRunner.query(`ALTER TABLE "file" ADD "specieId" integer`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "characteristicId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_a57841be2a748241227d7cf1aee" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_taxon" ADD CONSTRAINT "FK_51958d0c409b7eec19fa28204b9" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_taxon" ADD CONSTRAINT "FK_1a886ad3d4034695f3af51315dd" FOREIGN KEY ("taxonId") REFERENCES "taxon"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_characteristic" ADD CONSTRAINT "FK_36bf1168e81104f73a5d274ff3b" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_characteristic" ADD CONSTRAINT "FK_0f600b4e54ab02bb3bece3ef862" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_characteristic" ADD CONSTRAINT "FK_795b641bfc7db02d9f219ac444e" FOREIGN KEY ("taxonId") REFERENCES "taxon"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_characteristic" ADD CONSTRAINT "FK_36a0202a5d607d8e338abd3687d" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxon_characteristic" DROP CONSTRAINT "FK_36a0202a5d607d8e338abd3687d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxon_characteristic" DROP CONSTRAINT "FK_795b641bfc7db02d9f219ac444e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_characteristic" DROP CONSTRAINT "FK_0f600b4e54ab02bb3bece3ef862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_characteristic" DROP CONSTRAINT "FK_36bf1168e81104f73a5d274ff3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_taxon" DROP CONSTRAINT "FK_1a886ad3d4034695f3af51315dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_taxon" DROP CONSTRAINT "FK_51958d0c409b7eec19fa28204b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_a57841be2a748241227d7cf1aee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_fa267d0b4d28f1cfddd239dce03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP COLUMN "characteristicId"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "specieId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36a0202a5d607d8e338abd3687"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_795b641bfc7db02d9f219ac444"`,
    );
    await queryRunner.query(`DROP TABLE "taxon_characteristic"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0f600b4e54ab02bb3bece3ef86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36bf1168e81104f73a5d274ff3"`,
    );
    await queryRunner.query(`DROP TABLE "specie_characteristic"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a886ad3d4034695f3af51315d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51958d0c409b7eec19fa28204b"`,
    );
    await queryRunner.query(`DROP TABLE "specie_taxon"`);
  }
}
