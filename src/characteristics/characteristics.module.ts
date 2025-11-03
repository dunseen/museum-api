import { Module } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsController } from './characteristics.controller';
import { RelationalCharacteristicPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicTypePersistenceModule } from '../characteristic-types/infrastructure/persistence/relational/relational-persistence.module';
import { FileMinioModule } from '../files/infrastructure/uploader/minio/files.module';

@Module({
  imports: [
    RelationalCharacteristicPersistenceModule,
    RelationalCharacteristicTypePersistenceModule,
    FileMinioModule,
  ],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService, RelationalCharacteristicPersistenceModule],
})
export class CharacteristicsModule {}
