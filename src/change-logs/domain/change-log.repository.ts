import { ChangeLog } from './change-log';

export abstract class ChangeLogRepository {
  abstract create(
    data: Omit<ChangeLog, 'id' | 'createdAt'>,
  ): Promise<ChangeLog>;
}
