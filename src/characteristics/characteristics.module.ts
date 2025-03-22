import { Module } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsController } from './characteristics.controller';
import { RelationalCharacteristicPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicTypePersistenceModule } from '../characteristic-types/infrastructure/persistence/relational/relational-persistence.module';
import { ListHomeCharacteristicFiltersUseCase } from './application/use-cases/list-home-characteristic-filters.use-case';
import { FileMinioModule } from '../files/infrastructure/uploader/minio/files.module';

@Module({
  imports: [
    RelationalCharacteristicPersistenceModule,
    RelationalCharacteristicTypePersistenceModule,
    FileMinioModule,
  ],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService, ListHomeCharacteristicFiltersUseCase],
  exports: [CharacteristicsService, RelationalCharacteristicPersistenceModule],
})
export class CharacteristicsModule {}
