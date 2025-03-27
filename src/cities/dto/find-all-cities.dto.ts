import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindAllCitiesDto {
  @ApiProperty({
    type: Number,
    description: 'State id',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  stateId: number;
}
