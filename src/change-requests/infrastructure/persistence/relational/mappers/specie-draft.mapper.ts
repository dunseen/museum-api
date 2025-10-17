import { CharacteristicFactory } from '../../../../../characteristics/domain/characteristic.factory';
import { CharacteristicMapper } from '../../../../../characteristics/infrastructure/persistence/relational/mappers/characteristic.mapper';
import { CityMapper } from '../../../../../cities/infrastructure/persistence/relational/mappers/city.mapper';
import { SpecialistFactory } from '../../../../../specialists/domain/specialist.factory';
import { StateMapper } from '../../../../../states/infrastructure/persistence/relational/mappers/state.mapper';
import { TaxonMapper } from '../../../../../taxons/infrastructure/persistence/relational/mappers/taxon.mapper';
import { GetSpecieDraftDto } from '../../../../dto/get-specie-draft.dto';
import { SpecieDraftEntity } from '../entities/specie-draft.entity';

export class SpecieDraftMapper {
  static toDto(raw: SpecieDraftEntity): GetSpecieDraftDto {
    return {
      id: raw.id,
      specieId: raw.specie?.id ?? null,
      scientificName: raw.scientificName,
      commonName: raw.commonName ?? null,
      description: raw.description ?? null,
      collector: raw.collector ? SpecialistFactory.toDto(raw.collector) : null,
      determinator: raw.determinator
        ? SpecialistFactory.toDto(raw.determinator)
        : null,
      collectedAt: raw.collectedAt,
      determinatedAt: raw.determinatedAt,
      taxons: (raw.taxons ?? []).map((t) => {
        const tx = TaxonMapper.toDomain(t);
        return {
          id: tx.id,
          name: tx.name,
          hierarchy: {
            id: tx.hierarchy.id,
            name: tx.hierarchy.name,
          },
        };
      }),
      characteristics: (raw.characteristics ?? []).map((c) =>
        CharacteristicFactory.toDto(CharacteristicMapper.toDomain(c)),
      ),
      location: {
        address: raw.collectLocation ?? '',
        lat: raw.geoLocation.coordinates[1] as unknown as number,
        long: raw.geoLocation.coordinates[0] as unknown as number,
        city: CityMapper.toDomain(raw.city),
        state: StateMapper.toDomain(raw.state),
      },
    };
  }
}
