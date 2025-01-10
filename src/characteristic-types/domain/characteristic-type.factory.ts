import { GetCharacteristicTypeDto } from '../dto/get-characteristic-type.dto';
import { CharacteristicType } from './characteristic-type';

export class CharacteristicTypeFactory {
  static toDto(
    characteristicType: CharacteristicType,
  ): GetCharacteristicTypeDto {
    return {
      id: characteristicType.id!,
      name: characteristicType.name,
      createdAt: characteristicType.createdAt,
      updatedAt: characteristicType.updatedAt,
    };
  }
}
