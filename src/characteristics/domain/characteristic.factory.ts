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
        createdAt: characteristic.type.createdAt,
        updatedAt: characteristic.type.updatedAt,
      },
      files: [...characteristic.files],
      createdAt: characteristic.createdAt,
      updatedAt: characteristic.updatedAt,
    };
  }
}
