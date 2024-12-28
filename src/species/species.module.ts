import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { RelationalSpeciePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSpeciePersistenceModule],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService, RelationalSpeciePersistenceModule],
})
export class SpeciesModule {}
