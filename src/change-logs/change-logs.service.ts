import { Injectable } from '@nestjs/common';
import { ChangeLog } from './domain/change-log';
import { ChangeLogRepository } from './domain/change-log.repository';

@Injectable()
export class ChangeLogsService {
  constructor(private readonly repository: ChangeLogRepository) {}

  create(data: Omit<ChangeLog, 'id' | 'createdAt'>): Promise<ChangeLog> {
    return this.repository.create(data);
  }
}
