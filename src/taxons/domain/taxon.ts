import { ApiProperty } from '@nestjs/swagger';
import { Hierarchy } from '../../hierarchies/domain/hierarchy';
import { Characteristic } from '../../characteristics/domain/characteristic';

const TaxonIdType = Number;

export class Taxon {
  @ApiProperty({
    type: TaxonIdType,
  })
  id: number;

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

  @ApiProperty({ type: Characteristic, isArray: true })
  characteristics: Characteristic[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
