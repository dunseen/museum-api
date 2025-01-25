import { Module } from '@nestjs/common';
import { SpecieSeedService } from './specie-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecieEntity } from '../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { CharacteristicEntity } from '../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CharacteristicTypeEntity } from '../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecieEntity,
      CharacteristicEntity,
      CharacteristicTypeEntity,
      TaxonEntity,
      HierarchyEntity,
    ]),
  ],
  providers: [SpecieSeedService],
  exports: [SpecieSeedService],
})
export class SpecieSeedModule {}
