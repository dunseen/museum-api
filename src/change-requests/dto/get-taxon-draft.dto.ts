import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NullableType } from '../../utils/types/nullable.type';
import { ListHierarchyDto } from '../../hierarchies/application/dto/list-hiearchy.dto';
import { GetCharacteristicDto } from '../../characteristics/application/dto/get-characteristic.dto';

class ParentSummaryDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}

export class GetTaxonDraftDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: ListHierarchyDto })
  hierarchy: ListHierarchyDto;

  @ApiProperty({ type: ParentSummaryDto, nullable: true })
  parent: NullableType<ParentSummaryDto>;

  @ApiProperty({ type: GetCharacteristicDto, isArray: true })
  characteristics: GetCharacteristicDto[];

  @ApiPropertyOptional({ type: Object, nullable: true })
  diff?: Record<string, any> | null;
}
