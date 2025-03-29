import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { RelationalStatePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalStatePersistenceModule],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService, RelationalStatePersistenceModule],
})
export class StatesModule {}
