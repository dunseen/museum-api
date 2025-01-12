import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';

class TaxonomyDto {
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

class CharacteristicDto {
  @ApiProperty({
    type: Number,
  })
  id: number;
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiProperty({
    type: String,
  })
  type: string;
  @ApiProperty({
    type: String,
  })
  description: string;
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
  })
  commonName: string;

  @ApiProperty({ type: TaxonomyDto })
  taxonomy: TaxonomyDto;

  @ApiProperty({
    type: CharacteristicDto,
    isArray: true,
  })
  characteristics: CharacteristicDto[];

  @ApiProperty({
    type: FileType,
    isArray: true,
  })
  files: FileType[];
}
