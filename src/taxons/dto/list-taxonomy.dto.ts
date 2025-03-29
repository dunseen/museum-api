import { ApiProperty } from '@nestjs/swagger';

export class ListTaxonDto {
  @ApiProperty({
    type: String,
    description: 'Taxon name',
    example: 'Animalia',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Taxon hierarchy',
    example: 'Família',
  })
  hierarchy: string;
}
