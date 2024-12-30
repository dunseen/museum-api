import { Module } from '@nestjs/common';
import { CharacteristicTypeRepository } from '../characteristic-type.repository';
import { CharacteristicTypeRelationalRepository } from './repositories/characteristic-type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicTypeEntity } from './entities/characteristic-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicTypeEntity])],
  providers: [
    {
      provide: CharacteristicTypeRepository,
      useClass: CharacteristicTypeRelationalRepository,
    },
  ],
  exports: [CharacteristicTypeRepository],
})
export class RelationalCharacteristicTypePersistenceModule {}
