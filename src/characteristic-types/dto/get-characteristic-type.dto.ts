import { ApiProperty } from '@nestjs/swagger';

export class GetCharacteristicTypeDto {
  @ApiProperty({
    type: Number,
  })
  id?: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
