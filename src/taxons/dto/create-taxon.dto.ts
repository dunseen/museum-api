import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaxonDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  hierarchyId: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  parentId: number | null;

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  characteristicIds: number[];
}
