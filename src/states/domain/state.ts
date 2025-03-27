import { ApiProperty } from '@nestjs/swagger';

export class State {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;
}
