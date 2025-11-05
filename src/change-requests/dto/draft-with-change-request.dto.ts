import { ApiProperty } from '@nestjs/swagger';
import { SimpleChangeRequestDto } from './simple-change-request.dto';
import { EntityType } from '../domain/change-request';

export class ListChangeRequestDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ enum: EntityType })
  entityType: string; // Use EntityType enum values

  @ApiProperty({ type: String })
  entityName: string; // Generic name field (scientificName, name, etc.)

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: SimpleChangeRequestDto })
  changeRequest: SimpleChangeRequestDto;
}
