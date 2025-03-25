import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { ListTaxonDto } from '../../taxons/dto/list-taxonomy.dto';
import { GetSimpleCharacteristicDto } from '../../characteristics/application/dto/get-simple-characteristic.dto';
import { NullableType } from '../../utils/types/nullable.type';

export class GetSpecieDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  scientificName: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  commonName: NullableType<string>;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description: NullableType<string>;

  @ApiProperty({ type: ListTaxonDto })
  taxonomy: ListTaxonDto;

  @ApiProperty({
    type: GetSimpleCharacteristicDto,
    isArray: true,
  })
  characteristics: GetSimpleCharacteristicDto[];

  @ApiProperty({
    type: FileType,
    isArray: true,
  })
  files: FileType[];
}
