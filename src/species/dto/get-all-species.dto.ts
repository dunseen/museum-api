import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { ListTaxonDto } from '../../taxons/dto/list-taxonomy.dto';
import { GetSimpleCharacteristicDto } from '../../characteristics/application/dto/get-simple-characteristic.dto';
import { NullableType } from '../../utils/types/nullable.type';
import { LocationDto } from './create-specie.dto';
import { City } from '../../cities/domain/city';
import { State } from '../../states/domain/state';

class ListLocationDto extends PartialType(LocationDto) {
  @ApiProperty({
    type: City,
  })
  city: City;

  @ApiProperty({
    type: State,
  })
  state: State;
}
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

  @ApiProperty({
    type: Date,
  })
  collectedAt: Date;

  @ApiProperty({ type: ListTaxonDto, isArray: true })
  taxons: ListTaxonDto[];

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

  @ApiProperty({
    type: ListLocationDto,
  })
  location: ListLocationDto;
}
