import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { LocationDto } from './create-specie.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NullableType } from '../../utils/types/nullable.type';
import {
  optionalCsvToNumberArray,
  optionalCsvToStringArray,
} from '../../utils/transformers/optional-csv.transformer';
import { optionalJsonParse } from '../../utils/transformers/optional-json.transformer';

export class UpdateLocationDto extends PartialType(LocationDto) {}

export class UpdateSpecieDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  scientificName?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  commonName?: NullableType<string>;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description:
      'Taxon ids separated by commas. Empty string clears all. Omit to keep.',
    example: '1,2,3',
  })
  @IsOptional()
  @optionalCsvToNumberArray()
  taxonIds?: number[];

  @ApiPropertyOptional({
    type: String,
    description:
      'Characteristic ids separated by commas. Empty string clears all. Omit to keep.',
    example: '1,2,3',
  })
  @IsOptional()
  @optionalCsvToNumberArray()
  characteristicIds?: number[];

  @ApiPropertyOptional({
    type: UpdateLocationDto,
    description:
      'Location updates; send only changed fields. Stringified JSON allowed.',
  })
  @Type(() => UpdateLocationDto)
  @optionalJsonParse()
  @IsOptional()
  location?: UpdateLocationDto;

  @ApiPropertyOptional({ type: String })
  @IsUUID()
  @IsOptional()
  collectorId?: string;

  @ApiPropertyOptional({ type: String })
  @IsUUID()
  @IsOptional()
  determinatorId?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  collectedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  determinatedAt?: Date;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    description:
      'Files UUIDs to delete separated by commas. Empty string clears none. Omit to skip.',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  @optionalCsvToStringArray()
  filesToDelete?: string[];
}
