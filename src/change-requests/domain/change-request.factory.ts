import { UserFactory } from '../../users/domain/user.factory';
import { GetChangeRequestDto } from '../dto/get-change-request.dto';
import { ChangeRequest } from './change-request';

export class ChangeRequestFactory {
  static toDto(cr: ChangeRequest): GetChangeRequestDto {
    return {
      id: cr.id,
      entityType: cr.entityType,
      action: cr.action,
      status: cr.status,
      entityId: cr.entityId,
      proposedBy: UserFactory.createAuthor(cr.proposedBy),
      reviewedBy: cr.reviewedBy ? UserFactory.createAuthor(cr.reviewedBy) : null,
      proposedAt: cr.proposedAt,
      decidedAt: cr.decidedAt,
      summary: cr.summary ?? null,
      reviewerNote: cr.reviewerNote ?? null,
    };
  }
}

