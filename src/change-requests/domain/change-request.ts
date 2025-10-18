import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export enum ChangeRequestAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ChangeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export class ChangeRequest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  entityType: string; // e.g., 'specie', 'characteristic', 'taxon'

  @ApiProperty({ enum: ChangeRequestAction })
  action: ChangeRequestAction;

  @ApiProperty({ enum: ChangeRequestStatus })
  status: ChangeRequestStatus;

  @ApiProperty({ required: false, nullable: true })
  entityId: number | null; // Entity being modified/deleted (null for CREATE until approved)

  @ApiProperty({ required: false, nullable: true })
  draftId: number | null; // Polymorphic reference to draft table (used for all actions)

  @ApiProperty({ type: User })
  proposedBy: User;

  @ApiProperty({ required: false, nullable: true, type: User })
  reviewedBy: User | null;

  @ApiProperty()
  proposedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  decidedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  summary?: string | null;

  @ApiProperty({ required: false, nullable: true })
  reviewerNote?: string | null;

  @ApiProperty({ required: false, type: Object, nullable: true })
  diff?: unknown | null;
}
