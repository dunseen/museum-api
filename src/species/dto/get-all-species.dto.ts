import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { ListTaxonDto } from '../../taxons/dto/list-taxonomy.dto';
import { GetSimpleCharacteristicDto } from '../../characteristics/dto/get-simple-characteristic.dto';

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
  })
  commonName: string;

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
