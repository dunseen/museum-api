import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NullableType } from '../../utils/types/nullable.type';
import { Transform } from 'class-transformer';

export class CreateSpecieDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  scientificName: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  commonName: NullableType<string>;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value).map(Number))
  taxonIds: number[];

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value).map(Number))
  characteristicIds: number[];

  @IsOptional()
  file?: Express.Multer.File;
}
