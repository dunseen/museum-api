import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllCharacteristicsDto {
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

  @ApiPropertyOptional({ description: 'Filter by characteristic name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by characteristic type ids separated by comma',
    example: '1,2,3',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  characteristicTypeIds: string[];
}
