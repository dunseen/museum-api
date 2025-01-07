import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpecieDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  scientificName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  commonName: string;

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @IsNotEmpty()
  taxonIds: number[];

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @IsNotEmpty()
  characteristicIds: number[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsNotEmpty({ each: true })
  @IsUUID('all', { each: true })
  fileIds: string[];
}
