import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { RelationalstatePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalstatePersistenceModule],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService, RelationalstatePersistenceModule],
})
export class StatesModule {}
