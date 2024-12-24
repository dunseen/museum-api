import { Module } from '@nestjs/common';
import { speciesService } from './species.service';
import { speciesController } from './species.controller';
import { RelationalspeciesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalspeciesPersistenceModule],
  controllers: [speciesController],
  providers: [speciesService],
  exports: [speciesService, RelationalspeciesPersistenceModule],
})
export class speciesModule {}
