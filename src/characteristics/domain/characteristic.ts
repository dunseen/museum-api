import { ApiProperty } from '@nestjs/swagger';
import { CharacteristicType } from '../../characteristic-types/domain/characteristic-type';

export class Characteristic {
  @ApiProperty({
    type: String,
  })
  id: string | number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: CharacteristicType,
  })
  type: CharacteristicType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
