import { ApiProperty } from '@nestjs/swagger';

export class ListTaxonDto {
  @ApiProperty({
    type: String,
  })
  kingdom: string;
  @ApiProperty({
    type: String,
  })
  division: string;
  @ApiProperty({
    type: String,
  })
  class: string;
  @ApiProperty({
    type: String,
  })
  order: string;
  @ApiProperty({
    type: String,
  })
  family: string;
  @ApiProperty({
    type: String,
  })
  genus: string;
}
