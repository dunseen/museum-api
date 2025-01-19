import { CharacteristicFactory } from '../../characteristics/domain/characteristic.factory';
import { GetSpecieDto } from '../dto/get-all-species.dto';
import { ListHomePageSpeciesDto } from '../dto/list-home-page-species.dto';
import { Specie } from './specie';

export class SpecieFactory {
  static toDto(data: Specie): GetSpecieDto {
    const hierarchyMap = Object.fromEntries(
      data.taxons.map((taxon) => [taxon.hierarchy.name, taxon.name]),
    );

    return {
      id: data.id,
      scientificName: data.scientificName,
      commonName: data.commonName,
      description: data.description,
      characteristics: data.characteristics.map(CharacteristicFactory.toDto),
      taxonomy: {
        kingdom: hierarchyMap['reino'],
        division: hierarchyMap['divisão'],
        class: hierarchyMap['classe'],
        order: hierarchyMap['ordem'],
        family: hierarchyMap['família'],
        genus: hierarchyMap['gênero'],
      },
      files: data.files.map((f) => f),
    };
  }

  static toListHomePageDto(data: Specie): ListHomePageSpeciesDto {
    const hierarchyMap = Object.fromEntries(
      data.taxons.map((taxon) => [taxon.hierarchy.name, taxon.name]),
    );

    return {
      id: data.id,
      scientificName: data.scientificName,
      commonName: data.commonName,
      description: data.description,
      files: data.files.map((f) => f),
      taxonomy: {
        kingdom: hierarchyMap['reino'],
        division: hierarchyMap['divisão'],
        class: hierarchyMap['classe'],
        order: hierarchyMap['ordem'],
        family: hierarchyMap['família'],
        genus: hierarchyMap['gênero'],
      },
    };
  }
}
