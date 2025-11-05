import { GetCharacteristicDto } from '../application/dto/get-characteristic.dto';
import { Characteristic } from './characteristic';

export class CharacteristicFactory {
  static toDto(characteristic: Characteristic): GetCharacteristicDto {
    return {
      id: characteristic.id!,
      name: characteristic.name,
      type: {
        name: characteristic.type.name,
        id: characteristic.type.id,
      },
      files: [...characteristic.files],
      createdAt: characteristic.createdAt,
      updatedAt: characteristic.updatedAt,
    };
  }
}
