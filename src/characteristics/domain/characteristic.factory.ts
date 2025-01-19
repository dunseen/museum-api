import { GetCharacteristicDto } from '../application/dto/get-characteristic.dto';
import { Characteristic } from './characteristic';

export class CharacteristicFactory {
  static toDto(characteristic: Characteristic): GetCharacteristicDto {
    return {
      id: characteristic.id!,
      name: characteristic.name,
      description: characteristic.description,
      type: characteristic.type.name,
      files: [...characteristic.files],
      createdAt: characteristic.createdAt,
      updatedAt: characteristic.updatedAt,
    };
  }
}
