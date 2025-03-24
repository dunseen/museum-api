import { ApiProperty } from '@nestjs/swagger';
import { NullableType } from '../../utils/types/nullable.type';
import { ListHierarchyDto } from '../../hierarchies/application/dto/list-hiearchy.dto';
import { GetCharacteristicDto } from '../../characteristics/application/dto/get-characteristic.dto';

class ParentDto {
  @ApiProperty({
    type: Number,
  })
  id: number;
  @ApiProperty({
    type: String,
  })
  name: string;
}
export class GetTaxonDto {
  @ApiProperty({
    type: Number,
  })
  id: number;
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiProperty({
    type: ListHierarchyDto,
  })
  hierarchy: ListHierarchyDto;
  @ApiProperty({
    type: ParentDto,
    nullable: true,
  })
  parent: NullableType<ParentDto>;

  @ApiProperty({
    type: GetCharacteristicDto,
  })
  characteristics: GetCharacteristicDto[];
}
