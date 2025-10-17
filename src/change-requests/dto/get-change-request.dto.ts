import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ChangeRequestAction,
  ChangeRequestStatus,
} from '../domain/change-request';

export class UserAuthorDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String, nullable: true })
  email: string | null;
  @ApiProperty({ type: String, nullable: true })
  firstName: string | null;
  @ApiProperty({ type: String, nullable: true })
  lastName: string | null;
  @ApiProperty({ type: String, nullable: true })
  phone: string | null;
}

export class GetChangeRequestDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  entityType: string;

  @ApiProperty({ enum: ChangeRequestAction })
  action: ChangeRequestAction;

  @ApiProperty({ enum: ChangeRequestStatus })
  status: ChangeRequestStatus;

  @ApiPropertyOptional({ type: Number, nullable: true })
  entityId?: number | null;

  @ApiProperty({ type: UserAuthorDto })
  proposedBy: UserAuthorDto;

  @ApiPropertyOptional({ type: UserAuthorDto, nullable: true })
  reviewedBy?: UserAuthorDto | null;

  @ApiProperty({ type: Date })
  proposedAt: Date;

  @ApiPropertyOptional({ type: Date, nullable: true })
  decidedAt?: Date | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  summary?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reviewerNote?: string | null;
}
