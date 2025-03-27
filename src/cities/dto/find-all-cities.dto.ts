import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindAllCitiesDto {
  @ApiProperty({
    type: Number,
    description: 'State id',
    example: 1,
  })
  @IsNumber()
  stateId: number;
}
