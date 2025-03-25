import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { RelationalSpeciePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicPersistenceModule } from '../characteristics/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalTaxonPersistenceModule } from '../taxons/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalFilePersistenceModule } from '../files/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalSpeciePersistenceModule,
    RelationalCharacteristicPersistenceModule,
    RelationalTaxonPersistenceModule,
    RelationalFilePersistenceModule,
  ],
  controllers: [],
  providers: [SpeciesService],
  exports: [SpeciesService, RelationalSpeciePersistenceModule],
})
export class SpeciesModule {}
