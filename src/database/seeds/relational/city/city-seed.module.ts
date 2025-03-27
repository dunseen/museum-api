import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { CitySeedService } from './city-seed.service';
import { StateEntity } from '../../../../states/infrastructure/persistence/relational/entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, StateEntity])],
  providers: [CitySeedService],
  exports: [CitySeedService],
})
export class CitySeedModule {}
