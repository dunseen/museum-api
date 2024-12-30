import { ApiProperty } from '@nestjs/swagger';

export class CharacteristicType {
  @ApiProperty({
    type: String,
  })
  id: string | number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
