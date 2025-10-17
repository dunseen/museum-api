import { CharacteristicFactory } from '../../characteristics/domain/characteristic.factory';
import { SpecialistFactory } from '../../specialists/domain/specialist.factory';
import { GetSpecieDto } from '../dto/get-all-species.dto';
import { ListHomePageSpeciesDto } from '../dto/list-home-page-species.dto';
import { Specie } from './specie';

export class SpecieFactory {
  static toDto(data: Specie): GetSpecieDto {
    return {
      id: data.id,
      scientificName: data.scientificName,
      commonName: data.commonName,
      description: data.description,
      collector: SpecialistFactory.toDto(data.collector),
      determinator: SpecialistFactory.toDto(data.determinator),
      characteristics: data.characteristics.map(CharacteristicFactory.toDto),
      collectedAt: data.collectedAt,
      determinatedAt: data.determinatedAt,
      location: {
        address: data.collectLocation?.toString(),
        lat: data.lat,
        long: data.long,
        city: data.city,
        state: data.state,
      },
      taxons: data.taxons.map((taxon) => ({
        id: taxon.id,
        name: taxon.name,
        hierarchy: {
          id: taxon.hierarchy.id,
          name: taxon.hierarchy.name,
        },
      })),
      files: data.files.map((f) => f),
      status: data.status,
      statusReason: data.statusReason ?? null,
    };
  }

  static toListHomePageDto(data: Specie): ListHomePageSpeciesDto {
    return {
      id: data.id,
      scientificName: data.scientificName,
      commonName: data.commonName,
      description: data.description,
      files: data.files.map((f) => f),
      taxons: data.taxons.map((taxon) => ({
        id: taxon.id,
        name: taxon.name,
        hierarchy: {
          id: taxon.hierarchy.id,
          name: taxon.hierarchy.name,
        },
      })),
    };
  }
}
