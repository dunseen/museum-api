import { ApiProperty } from '@nestjs/swagger';
import { Hierarchy } from '../../hierarchies/domain/hierarchy';

const TaxonIdType = Number;

export class Taxon {
  @ApiProperty({
    type: TaxonIdType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: Hierarchy,
  })
  hierarchy: Hierarchy;

  @ApiProperty({
    type: Taxon,
  })
  parent: Taxon | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
