import { Module } from '@nestjs/common';
import { CharacteristicTypesService } from './characteristic-types.service';
import { RelationalCharacteristicTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCharacteristicTypePersistenceModule],
  controllers: [],
  providers: [CharacteristicTypesService],
  exports: [
    CharacteristicTypesService,
    RelationalCharacteristicTypePersistenceModule,
  ],
})
export class CharacteristicTypesModule {}
