import { Module } from '@nestjs/common';
import { SpecieRepository } from '../specie.repository';
import { SpecieRelationalRepository } from './repositories/specie.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecieEntity } from './entities/specie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecieEntity])],
  providers: [
    {
      provide: SpecieRepository,
      useClass: SpecieRelationalRepository,
    },
  ],
  exports: [SpecieRepository],
})
export class RelationalSpeciePersistenceModule {}
