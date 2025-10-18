import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ChangeRequestAction,
  ChangeRequestStatus,
} from '../domain/change-request';
import { UserAuthorDto } from './get-change-request.dto';

export class SimpleChangeRequestDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ enum: ChangeRequestStatus })
  status: ChangeRequestStatus;

  @ApiProperty({ enum: ChangeRequestAction })
  action: ChangeRequestAction;

  @ApiProperty({ type: UserAuthorDto })
  proposedBy: UserAuthorDto;

  @ApiPropertyOptional({ type: UserAuthorDto, nullable: true })
  reviewedBy?: UserAuthorDto | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reviewerNote?: string | null;

  @ApiProperty({ type: Date })
  proposedAt: Date;

  @ApiPropertyOptional({ type: Date, nullable: true })
  decidedAt?: Date | null;
}
