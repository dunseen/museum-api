import { ApiProperty } from '@nestjs/swagger';
import { State } from '../../states/domain/state';

export class City {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: State,
  })
  state: State;
}
