import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NullableType } from '../../utils/types/nullable.type';
import { Transform, Type } from 'class-transformer';

export class LocationDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  address: string;
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  stateId: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  cityId: number;

  @ApiProperty({
    type: Number,
    description: 'The latitude of the location',
    example: 40.73061,
  })
  @IsNumber()
  lat: number;
  @ApiProperty({
    type: Number,
    description: 'The longitude of the location',
    example: -73.935242,
  })
  @IsNumber()
  long: number;
}

export class CreateSpecieDto {
  @ApiProperty({
    type: String,
    description: 'The scientific name of the specie',
  })
  @IsString()
  scientificName: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'The common name of the specie',
  })
  @IsString()
  @IsOptional()
  commonName: NullableType<string>;

  @ApiProperty({
    type: String,
    description: 'The description of the specie',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description:
      'The ids of the taxons associated with the specie separated by commas',
    example: '1,2,3',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.split(',').map(Number))
  taxonIds: number[];

  @ApiProperty({
    type: String,
    description:
      'The ids of the characteristics associated with the specie separated by commas',
    example: '1,2,3',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.split(',').map(Number))
  characteristicIds: number[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'The file associated with the specie',
  })
  file: any;

  @ApiProperty({
    type: LocationDto,
    description: 'The location where the specie was collected',
  })
  @Type(() => LocationDto)
  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({
    type: String,
    description: 'The id of the collector of the specie',
    example: '123e4567-e89b-12d3-a456-426',
  })
  @IsUUID()
  collectorId: string;

  @ApiProperty({
    type: String,
    description: 'The id of the determinator of the specie',
    example: '123e4567-e89b-12d3-a456-426',
  })
  @IsUUID()
  determinatorId: string;

  @ApiProperty({
    type: Date,
    description: 'The date when the specie was collected',
  })
  @IsDateString()
  collectedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'The date when the specie was determinated',
  })
  @IsDateString()
  determinatedAt: Date;
}
