import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
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
}
