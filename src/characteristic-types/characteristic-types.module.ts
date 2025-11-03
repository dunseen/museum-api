import { Module } from '@nestjs/common';
import { CharacteristicTypesService } from './characteristic-types.service';
import { RelationalCharacteristicTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CharacteristicTypesController } from './characteristic-types.controller';

@Module({
  imports: [RelationalCharacteristicTypePersistenceModule],
  controllers: [CharacteristicTypesController],
  providers: [CharacteristicTypesService],
  exports: [
    CharacteristicTypesService,
    RelationalCharacteristicTypePersistenceModule,
  ],
})
export class CharacteristicTypesModule {}
