import { ApiProperty } from '@nestjs/swagger';

export class ListSummaryCountsDto {
  @ApiProperty({
    type: Number,
  })
  characteristicCount: number;

  @ApiProperty({
    type: Number,
  })
  familyCount: number;

  @ApiProperty({
    type: Number,
  })
  orderCount: number;

  @ApiProperty({
    type: Number,
  })
  specieCount: number;
}
