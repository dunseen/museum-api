import { Module } from '@nestjs/common';
import { CharacteristicRepository } from '../characteristic.repository';
import { CharacteristicRelationalRepository } from './repositories/characteristic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicEntity } from './entities/characteristic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicEntity])],
  providers: [
    {
      provide: CharacteristicRepository,
      useClass: CharacteristicRelationalRepository,
    },
  ],
  exports: [CharacteristicRepository],
})
export class RelationalCharacteristicPersistenceModule {}
