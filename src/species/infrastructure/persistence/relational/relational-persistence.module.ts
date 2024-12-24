import { Module } from '@nestjs/common';
import { speciesRepository } from '../species.repository';
import { speciesRelationalRepository } from './repositories/species.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { speciesEntity } from './entities/species.entity';

@Module({
  imports: [TypeOrmModule.forFeature([speciesEntity])],
  providers: [
    {
      provide: speciesRepository,
      useClass: speciesRelationalRepository,
    },
  ],
  exports: [speciesRepository],
})
export class RelationalspeciesPersistenceModule {}
