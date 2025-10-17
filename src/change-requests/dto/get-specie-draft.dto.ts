import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NullableType } from '../../utils/types/nullable.type';
import { ListTaxonDto } from '../../taxons/dto/list-taxonomy.dto';
import { GetSimpleCharacteristicDto } from '../../characteristics/application/dto/get-simple-characteristic.dto';
import { City } from '../../cities/domain/city';
import { State } from '../../states/domain/state';
import { Specialist } from '../../specialists/domain/specialist';

export class DraftLocationDto {
  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: Number })
  lat: number;

  @ApiProperty({ type: Number })
  long: number;

  @ApiProperty({ type: City })
  city: City;

  @ApiProperty({ type: State })
  state: State;
}

export class GetSpecieDraftDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: Number, nullable: true })
  specieId?: number | null;

  @ApiProperty({ type: String })
  scientificName: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  commonName: NullableType<string>;

  @ApiPropertyOptional({ type: String, nullable: true })
  description: NullableType<string>;

  @ApiPropertyOptional({ type: Specialist, nullable: true })
  collector: NullableType<Specialist>;

  @ApiPropertyOptional({ type: Specialist, nullable: true })
  determinator: NullableType<Specialist>;

  @ApiProperty({ type: Date })
  collectedAt: Date;

  @ApiProperty({ type: Date })
  determinatedAt: Date;

  @ApiProperty({ type: ListTaxonDto, isArray: true })
  taxons: ListTaxonDto[];

  @ApiProperty({ type: GetSimpleCharacteristicDto, isArray: true })
  characteristics: GetSimpleCharacteristicDto[];

  @ApiProperty({ type: DraftLocationDto })
  location: DraftLocationDto;
}
