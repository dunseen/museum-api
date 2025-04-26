import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllPostsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page = 1;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit = 10;

  @ApiPropertyOptional({
    description: 'Filter by specie name',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Filter by order hierarchy id',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  orderHierarchyId: number;

  @ApiPropertyOptional({
    description: 'Filter by order name',
    example: 'Acanthocobitis',
    type: String,
  })
  @IsString()
  @IsOptional()
  orderName: string;

  @ApiPropertyOptional({
    description: 'Filter by family hierarchy id',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  familyHierarchyId: number;

  @ApiPropertyOptional({
    description: 'Filter by family name',
    example: 'Acanthocobitis',
    type: String,
  })
  @IsString()
  @IsOptional()
  familyName: string;

  @ApiPropertyOptional({
    description: 'Filter by genus hierarchy id',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  genusHierarchyId: number;

  @ApiPropertyOptional({
    description: 'Filter by genus name',
    example: 'Acanthocobitis',
    type: String,
  })
  @IsString()
  @IsOptional()
  genusName: string;

  @ApiPropertyOptional({
    description: 'Filter by characteristic ids separated by comma',
    example: '1,2,3',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  characteristicIds: string[];
}
