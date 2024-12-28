import { Module } from '@nestjs/common';
import { SpeciesRepository } from '../species.repository';
import { SpeciesRelationalRepository } from './repositories/species.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesEntity } from './entities/species.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesEntity])],
  providers: [
    {
      provide: SpeciesRepository,
      useClass: SpeciesRelationalRepository,
    },
  ],
  exports: [SpeciesRepository],
})
export class RelationalSpeciesPersistenceModule {}
