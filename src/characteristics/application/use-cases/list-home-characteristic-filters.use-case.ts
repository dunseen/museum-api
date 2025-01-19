import { Injectable } from '@nestjs/common';
import { CharacteristicRepository } from '../../domain/characteristic.repository';
import { CharacteristicTypeRepository } from '../../../characteristic-types/infrastructure/persistence/characteristic-type.repository';
import { ListHomeCharacteristicFiltersDto } from '../dto/list-home-characteristic-filters.dto';

@Injectable()
export class ListHomeCharacteristicFiltersUseCase {
  constructor(
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
  ) {}
  async execute(): Promise<ListHomeCharacteristicFiltersDto[]> {
    const types = await this.characteristicTypeRepository.findAll();

    const promise = types.map(async (t) => {
      const characteristics =
        await this.characteristicRepository.findAllByTypeId(t.id);

      return {
        type: t.name,
        characteristics: characteristics.map((c) => ({
          id: c.id,
          name: c.name,
        })),
      };
    });

    return Promise.all(promise);
  }
}
