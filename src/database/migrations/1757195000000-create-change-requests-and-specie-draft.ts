import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChangeRequestsAndSpecieDraft1757195000000
  implements MigrationInterface
{
  name = 'CreateChangeRequestsAndSpecieDraft1757195000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // enums
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_action_enum" AS ENUM('create','update','delete')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_status_enum" AS ENUM('pending','approved','rejected','withdrawn')`,
    );

    // change_request table
    await queryRunner.query(
      `CREATE TABLE "change_request" (
        "id" SERIAL NOT NULL,
        "entityType" character varying(50) NOT NULL,
        "action" "public"."change_request_action_enum" NOT NULL,
        "status" "public"."change_request_status_enum" NOT NULL DEFAULT 'pending',
        "entityId" integer,
        "proposedById" uuid NOT NULL,
        "reviewedById" uuid,
        "proposedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "decidedAt" TIMESTAMP,
        "summary" text,
        "reviewerNote" text,
        "diff" jsonb,
        CONSTRAINT "PK_change_request_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_change_request_entity_type_status" ON "change_request" ("entityType", "status")`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_change_request_proposed_by" FOREIGN KEY ("proposedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_change_request_reviewed_by" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // specie_draft table
    await queryRunner.query(
      `CREATE TABLE "specie_draft" (
        "id" SERIAL NOT NULL,
        "changeRequestId" integer NOT NULL,
        "specieId" integer,
        "scientificName" character varying(255) NOT NULL,
        "commonName" character varying(100),
        "description" character varying(255),
        "collectLocation" character varying(255),
        "geoLocation" geography(Point,4326) NOT NULL,
        "stateId" integer,
        "cityId" integer,
        "collectorId" uuid,
        "determinatorId" uuid,
        "collectedAt" TIMESTAMP NOT NULL,
        "determinatedAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_specie_draft_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_change_request" FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_specie" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_state" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_city" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_collector" FOREIGN KEY ("collectorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_determinator" FOREIGN KEY ("determinatorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // join tables
    await queryRunner.query(
      `CREATE TABLE "specie_draft_taxon" (
        "specieDraftId" integer NOT NULL,
        "taxonId" integer NOT NULL,
        CONSTRAINT "PK_specie_draft_taxon" PRIMARY KEY ("specieDraftId","taxonId")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_draft_taxon_draft" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_draft_taxon_taxon" FOREIGN KEY ("taxonId") REFERENCES "taxon"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE "specie_draft_characteristic" (
        "specieDraftId" integer NOT NULL,
        "characteristicId" integer NOT NULL,
        CONSTRAINT "PK_specie_draft_characteristic" PRIMARY KEY ("specieDraftId","characteristicId")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_draft_characteristic_draft" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_draft_characteristic_characteristic" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_draft_characteristic_characteristic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_draft_characteristic_draft"`,
    );
    await queryRunner.query(`DROP TABLE "specie_draft_characteristic"`);

    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_draft_taxon_taxon"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_draft_taxon_draft"`,
    );
    await queryRunner.query(`DROP TABLE "specie_draft_taxon"`);

    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_determinator"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_collector"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_state"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_specie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_change_request"`,
    );
    await queryRunner.query(`DROP TABLE "specie_draft"`);

    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_change_request_reviewed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_change_request_proposed_by"`,
    );
    await queryRunner.query(
      `
      DROP INDEX "public"."IDX_change_request_entity_type_status"`,
    );
    await queryRunner.query(`DROP TABLE "change_request"`);
    await queryRunner.query(`DROP TYPE "public"."change_request_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."change_request_action_enum"`);
  }
}
