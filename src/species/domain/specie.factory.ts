import { GetAllSpecieDto } from '../dto/get-all-species.dto';
import { Specie } from './specie';

export class SpecieFactory {
  static createSpecieListDto(data: Specie[]): GetAllSpecieDto[] {
    return data.map((d) => {
      const hierarchyMap = Object.fromEntries(
        d.taxons.map((taxon) => [taxon.hierarchy.name, taxon.name]),
      );

      return {
        id: d.id,
        scientificName: d.scientificName,
        commonName: d.commonName,
        characteristics: d.characteristics.map((c) => ({
          id: Number(c.id),
          name: c.name,
          description: c.description,
          type: c.type.name,
        })),
        taxonomy: {
          kingdom: hierarchyMap['reino'],
          division: hierarchyMap['divisão'],
          class: hierarchyMap['classe'],
          order: hierarchyMap['ordem'],
          family: hierarchyMap['família'],
          genus: hierarchyMap['gênero'],
        },
      };
    });
  }
}
