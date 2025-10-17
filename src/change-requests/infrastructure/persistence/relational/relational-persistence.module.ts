import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequestEntity } from './entities/change-request.entity';
import { ChangeRequestRepository } from '../../../domain/change-request.repository';
import { ChangeRequestRelationalRepository } from './repositories/change-request.repository';
import { SpecieDraftEntity } from './entities/specie-draft.entity';
import { SpecieEntity } from '../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { CharacteristicEntity } from '../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CityEntity } from '../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { StateEntity } from '../../../../states/infrastructure/persistence/relational/entities/state.entity';
import { SpecialistEntity } from '../../../../specialists/infrastructure/persistence/relational/entities/specialist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChangeRequestEntity,
      SpecieDraftEntity,
      SpecieEntity,
      TaxonEntity,
      CharacteristicEntity,
      CityEntity,
      StateEntity,
      SpecialistEntity,
    ]),
  ],
  providers: [
    {
      provide: ChangeRequestRepository,
      useClass: ChangeRequestRelationalRepository,
    },
  ],
  exports: [ChangeRequestRepository, TypeOrmModule],
})
export class RelationalChangeRequestPersistenceModule {}
