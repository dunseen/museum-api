import { Module } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsController } from './characteristics.controller';
import { RelationalCharacteristicPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicTypePersistenceModule } from '../characteristic-types/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalCharacteristicPersistenceModule,
    RelationalCharacteristicTypePersistenceModule,
  ],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService, RelationalCharacteristicPersistenceModule],
})
export class CharacteristicsModule {}
