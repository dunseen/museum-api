import { Module } from '@nestjs/common';
import { CityRepository } from '../city.repository';
import { CityRelationalRepository } from './repositories/city.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [
    {
      provide: CityRepository,
      useClass: CityRelationalRepository,
    },
  ],
  exports: [CityRepository],
})
export class RelationalCityPersistenceModule {}
