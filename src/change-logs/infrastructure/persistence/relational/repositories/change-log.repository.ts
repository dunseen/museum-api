import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeLogRepository } from '../../../../domain/change-log.repository';
import { ChangeLog } from '../../../../domain/change-log';
import { ChangeLogEntity } from '../entities/change-log.entity';
import { ChangeLogMapper } from '../mappers/change-log.mapper';

@Injectable()
export class ChangeLogRelationalRepository implements ChangeLogRepository {
  constructor(
    @InjectRepository(ChangeLogEntity)
    private readonly repository: Repository<ChangeLogEntity>,
  ) {}

  async create(data: Omit<ChangeLog, 'id' | 'createdAt'>): Promise<ChangeLog> {
    const entity = this.repository.create(ChangeLogMapper.toPersistence(data));
    const saved = await this.repository.save(entity);
    return saved;
  }
}
