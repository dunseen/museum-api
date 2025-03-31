import { ApiProperty } from '@nestjs/swagger';
import { ListHierarchyDto } from '../../hierarchies/application/dto/list-hiearchy.dto';

export class ListTaxonDto {
  @ApiProperty({
    type: Number,
    description: 'Taxon id',
    example: 1,
  })
  id: number;
  @ApiProperty({
    type: String,
    description: 'Taxon name',
    example: 'Animalia',
  })
  name: string;
  @ApiProperty({
    type: ListHierarchyDto,
    description: 'Taxon hierarchy',
  })
  hierarchy: ListHierarchyDto;
}
