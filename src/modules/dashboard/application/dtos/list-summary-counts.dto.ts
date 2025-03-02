import { ApiProperty } from '@nestjs/swagger';

export class ListSummaryCountsDto {
  @ApiProperty({
    type: Number,
    example: 0,
  })
  characteristicCount: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  familyCount: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  genusCount: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  specieCount: number;
}
