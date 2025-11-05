import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequestRepository } from '../../../../domain/change-request.repository';
import {
  ChangeRequest,
  ChangeRequestStatus,
} from '../../../../domain/change-request';
import { ChangeRequestEntity } from '../entities/change-request.entity';
import { ChangeRequestMapper } from '../mappers/change-request.mapper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class ChangeRequestRelationalRepository
  implements ChangeRequestRepository
{
  constructor(
    @InjectRepository(ChangeRequestEntity)
    private readonly repo: Repository<ChangeRequestEntity>,
  ) {}

  async create(
    data: Omit<ChangeRequest, 'id' | 'proposedAt' | 'decidedAt'>,
  ): Promise<ChangeRequest> {
    const entity = this.repo.create(ChangeRequestMapper.toPersistence(data));
    const saved = await this.repo.save(entity);
    return ChangeRequestMapper.toDomain(saved);
  }

  async findById(id: number): Promise<ChangeRequest | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? ChangeRequestMapper.toDomain(found) : null;
  }

  async findPendingByEntity(
    entityType: string,
    entityId: number,
  ): Promise<ChangeRequest | null> {
    const found = await this.repo.findOne({
      where: { entityType, entityId, status: ChangeRequestStatus.PENDING },
    });
    return found ? ChangeRequestMapper.toDomain(found) : null;
  }

  async markApproved(id: number, reviewerId: string): Promise<void> {
    const reviewer = new UserEntity();
    reviewer.id = reviewerId;
    await this.repo.update(
      { id },
      {
        status: ChangeRequestStatus.APPROVED,
        decidedAt: new Date(),
        reviewedBy: reviewer,
      },
    );
  }

  async markRejected(
    id: number,
    reviewerId: string,
    reviewerNote?: string,
  ): Promise<void> {
    const reviewer = new UserEntity();
    reviewer.id = reviewerId;
    await this.repo.update(
      { id },
      {
        status: ChangeRequestStatus.REJECTED,
        decidedAt: new Date(),
        reviewerNote: reviewerNote ?? null,
        reviewedBy: reviewer,
      },
    );
  }
}
