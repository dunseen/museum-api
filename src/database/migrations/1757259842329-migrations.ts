import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1757259842329 implements MigrationInterface {
  name = 'Migrations1757259842329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_change_request_proposed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_change_request_reviewed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_change_request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_collector"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_determinator"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_specie"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_specie_draft_state"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_draft_taxon_draft"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_draft_taxon_taxon"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_draft_characteristic_characteristic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_draft_characteristic_draft"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_change_request_entity_type_status"`,
    );
    await queryRunner.query(`ALTER TABLE "file" ADD "changeRequestId" integer`);
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_action_enum" RENAME TO "change_request_action_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_action_enum" AS ENUM('create', 'update', 'delete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "action" TYPE "public"."change_request_action_enum" USING "action"::"text"::"public"."change_request_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."change_request_action_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_status_enum" RENAME TO "change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_status_enum" AS ENUM('pending', 'approved', 'rejected', 'withdrawn')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" TYPE "public"."change_request_status_enum" USING "status"::"text"::"public"."change_request_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "proposedById" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ALTER COLUMN "changeRequestId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bafc65a5dc16fadd3e46df7ea9" ON "change_request" ("entityType") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36b73b092a19a9cf257482de15" ON "change_request" ("entityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a00722ae7970810f8a0ecd69d" ON "specie_draft_taxon" ("specieDraftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b78e2a74bd7d77ee8c9e9e7c3" ON "specie_draft_taxon" ("taxonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46bda902c47625a8dffbedfcfd" ON "specie_draft_characteristic" ("specieDraftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3692c584a653686ffaf995f2c3" ON "specie_draft_characteristic" ("characteristicId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_e3e3afb873fce19b69457e9e085" FOREIGN KEY ("proposedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_a40c6029287d9952fbe44569f5a" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_30b027c292ea1dfe78caeabfc88" FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_b43404d3f8e2e834133e978571d" FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_a9ea7513edf6bc1e47ebaefbf59" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_ecd9bc577d190d1ac1d4f8aacda" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_fb5fef6f6ddfee5ef1e003a0993" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_4320589e6a01f142cb41239e713" FOREIGN KEY ("collectorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_41a3f9085d7630d7f7a8901a8f9" FOREIGN KEY ("determinatorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_9a00722ae7970810f8a0ecd69d7" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_0b78e2a74bd7d77ee8c9e9e7c3a" FOREIGN KEY ("taxonId") REFERENCES "taxon"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_46bda902c47625a8dffbedfcfd6" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_3692c584a653686ffaf995f2c32" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_3692c584a653686ffaf995f2c32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" DROP CONSTRAINT "FK_46bda902c47625a8dffbedfcfd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_0b78e2a74bd7d77ee8c9e9e7c3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" DROP CONSTRAINT "FK_9a00722ae7970810f8a0ecd69d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_41a3f9085d7630d7f7a8901a8f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_4320589e6a01f142cb41239e713"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_fb5fef6f6ddfee5ef1e003a0993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_ecd9bc577d190d1ac1d4f8aacda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_a9ea7513edf6bc1e47ebaefbf59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" DROP CONSTRAINT "FK_b43404d3f8e2e834133e978571d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_30b027c292ea1dfe78caeabfc88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_a40c6029287d9952fbe44569f5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" DROP CONSTRAINT "FK_e3e3afb873fce19b69457e9e085"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3692c584a653686ffaf995f2c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_46bda902c47625a8dffbedfcfd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b78e2a74bd7d77ee8c9e9e7c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a00722ae7970810f8a0ecd69d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36b73b092a19a9cf257482de15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bafc65a5dc16fadd3e46df7ea9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ALTER COLUMN "changeRequestId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "proposedById" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_status_enum_old" AS ENUM('pending', 'approved', 'rejected', 'withdrawn')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" TYPE "public"."change_request_status_enum_old" USING "status"::"text"::"public"."change_request_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."change_request_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_status_enum_old" RENAME TO "change_request_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."change_request_action_enum_old" AS ENUM('create', 'update', 'delete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ALTER COLUMN "action" TYPE "public"."change_request_action_enum_old" USING "action"::"text"::"public"."change_request_action_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."change_request_action_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."change_request_action_enum_old" RENAME TO "change_request_action_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "changeRequestId"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_change_request_entity_type_status" ON "change_request" ("entityType", "status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_draft_characteristic_draft" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_characteristic" ADD CONSTRAINT "FK_draft_characteristic_characteristic" FOREIGN KEY ("characteristicId") REFERENCES "characteristic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_draft_taxon_taxon" FOREIGN KEY ("taxonId") REFERENCES "taxon"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft_taxon" ADD CONSTRAINT "FK_draft_taxon_draft" FOREIGN KEY ("specieDraftId") REFERENCES "specie_draft"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_state" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_specie" FOREIGN KEY ("specieId") REFERENCES "specie"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_determinator" FOREIGN KEY ("determinatorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_collector" FOREIGN KEY ("collectorId") REFERENCES "specialist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_city" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specie_draft" ADD CONSTRAINT "FK_specie_draft_change_request" FOREIGN KEY ("changeRequestId") REFERENCES "change_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_change_request_reviewed_by" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_request" ADD CONSTRAINT "FK_change_request_proposed_by" FOREIGN KEY ("proposedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
