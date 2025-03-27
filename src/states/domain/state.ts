import { ApiProperty } from '@nestjs/swagger';

export class State {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Pará',
  })
  name: string;
  @ApiProperty({
    type: String,
    example: 'PA',
  })
  code: string;
}
