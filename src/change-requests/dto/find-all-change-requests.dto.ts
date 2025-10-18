import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ChangeRequestAction,
  ChangeRequestStatus,
} from '../domain/change-request';

export class FindAllChangeRequestsDto {
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

  @ApiPropertyOptional({ enum: ChangeRequestStatus })
  @IsEnum(ChangeRequestStatus)
  @IsOptional()
  status?: ChangeRequestStatus;

  @ApiPropertyOptional({ enum: ChangeRequestAction })
  @IsEnum(ChangeRequestAction)
  @IsOptional()
  action?: ChangeRequestAction;

  @ApiPropertyOptional({
    description: 'Search by scientific name, author or validator',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
