import { Module } from '@nestjs/common';
import { TaxonsService } from './taxons.service';
import { TaxonsController } from './taxons.controller';
import { RelationalTaxonPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalHierarchyPersistenceModule } from '../hierarchies/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicPersistenceModule } from '../characteristics/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalTaxonPersistenceModule,
    RelationalHierarchyPersistenceModule,
    RelationalCharacteristicPersistenceModule,
  ],
  controllers: [TaxonsController],
  providers: [TaxonsService],
  exports: [TaxonsService, RelationalTaxonPersistenceModule],
})
export class TaxonsModule {}
