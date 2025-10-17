import { ChangeRequest } from './change-request';

export abstract class ChangeRequestRepository {
  abstract create(
    data: Omit<ChangeRequest, 'id' | 'proposedAt' | 'decidedAt'>,
  ): Promise<ChangeRequest>;

  abstract findById(id: number): Promise<ChangeRequest | null>;

  abstract findPendingByEntity(
    entityType: string,
    entityId: number,
  ): Promise<ChangeRequest | null>;

  abstract markApproved(id: number, reviewerId: string): Promise<void>;

  abstract markRejected(
    id: number,
    reviewerId: string,
    reviewerNote?: string,
  ): Promise<void>;
}
