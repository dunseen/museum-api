import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { RelationalCityPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCityPersistenceModule],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService, RelationalCityPersistenceModule],
})
export class CitiesModule {}
