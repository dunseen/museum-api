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

export enum EntityType {
  SPECIE = 'specie',
  CHARACTERISTIC = 'characteristic',
  TAXON = 'taxon',
  // Add new entity types here as they are implemented
}

export class ChangeRequest {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: EntityType })
  entityType: string; // Use EntityType enum values

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
