import {
  ChangeRequest,
  ChangeRequestAction,
  ChangeRequestStatus,
} from '../../../../domain/change-request';
import { ChangeRequestEntity } from '../entities/change-request.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class ChangeRequestMapper {
  static toDomain(raw: ChangeRequestEntity): ChangeRequest {
    const domain = new ChangeRequest();
    domain.id = raw.id;
    domain.entityType = raw.entityType;
    domain.action = raw.action;
    domain.status = raw.status;
    domain.entityId = raw.entityId ?? null;
    domain.proposedBy = UserMapper.toDomain(raw.proposedBy);
    domain.reviewedBy = raw.reviewedBy
      ? UserMapper.toDomain(raw.reviewedBy)
      : null;
    domain.proposedAt = raw.proposedAt;
    domain.decidedAt = raw.decidedAt ?? null;
    domain.summary = raw.summary ?? null;
    domain.reviewerNote = raw.reviewerNote ?? null;
    domain.diff = raw.diff ?? null;
    return domain;
  }

  static toPersistence(domain: Partial<ChangeRequest>): ChangeRequestEntity {
    const entity = new ChangeRequestEntity();
    if (domain.id !== undefined) entity.id = domain.id as number;
    if (domain.entityType !== undefined)
      entity.entityType = domain.entityType as string;
    if (domain.action !== undefined)
      entity.action = domain.action as ChangeRequestAction;
    if (domain.status !== undefined)
      entity.status = domain.status as ChangeRequestStatus;
    if (domain.entityId !== undefined)
      entity.entityId = (domain.entityId as number) ?? null;
    if (domain.proposedBy !== undefined)
      entity.proposedBy = UserMapper.toPersistence(domain.proposedBy);
    if (domain.reviewedBy !== undefined)
      entity.reviewedBy = domain.reviewedBy
        ? UserMapper.toPersistence(domain.reviewedBy)
        : null;
    if (domain.proposedAt !== undefined)
      entity.proposedAt = domain.proposedAt as Date;
    if (domain.decidedAt !== undefined)
      entity.decidedAt = (domain.decidedAt as Date) ?? null;
    if (domain.summary !== undefined)
      entity.summary = (domain.summary as string) ?? null;
    if (domain.reviewerNote !== undefined)
      entity.reviewerNote = (domain.reviewerNote as string) ?? null;
    if (domain.diff !== undefined) entity.diff = domain.diff ?? null;
    return entity;
  }
}
