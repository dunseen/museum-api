import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
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
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService, RelationalSpeciePersistenceModule],
})
export class SpeciesModule {}
