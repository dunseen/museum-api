import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { RelationalSpeciesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSpeciesPersistenceModule],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService, RelationalSpeciesPersistenceModule],
})
export class SpeciesModule {}
