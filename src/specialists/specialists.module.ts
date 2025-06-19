import { Module } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { RelationalSpecialistPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSpecialistPersistenceModule],
  controllers: [],
  providers: [SpecialistsService],
  exports: [SpecialistsService, RelationalSpecialistPersistenceModule],
})
export class SpecialistsModule {}
