import { Module } from '@nestjs/common';
import { CharacteristicTypesService } from './characteristic-types.service';
import { CharacteristicTypesController } from './characteristic-types.controller';
import { RelationalCharacteristicTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

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
