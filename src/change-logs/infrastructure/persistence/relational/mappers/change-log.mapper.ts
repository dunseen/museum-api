import { ChangeLog } from '../../../../domain/change-log';
import { ChangeLogEntity } from '../entities/change-log.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class ChangeLogMapper {
  static toDomain(raw: ChangeLogEntity): ChangeLog {
    const domain = new ChangeLog();
    domain.id = raw.id;
    domain.tableName = raw.tableName;
    domain.action = raw.action;
    domain.oldValue = raw.oldValue;
    domain.newValue = raw.newValue;
    domain.changedBy = UserMapper.toDomain(raw.changedBy);
    domain.approvedBy = UserMapper.toDomain(raw.approvedBy);
    domain.createdAt = raw.createdAt;

    return domain;
  }

  static toPersistence(domain: Partial<ChangeLog>): ChangeLogEntity {
    const entity = new ChangeLogEntity();
    if (domain.id) entity.id = domain.id;

    entity.tableName = domain.tableName ?? '';
    entity.action = domain.action ?? '';
    entity.oldValue = domain.oldValue ?? null;
    entity.newValue = domain.newValue ?? null;

    if (domain.changedBy)
      entity.changedBy = UserMapper.toPersistence(domain.changedBy);

    if (domain.approvedBy)
      entity.approvedBy = UserMapper.toPersistence(domain.approvedBy);

    if (domain.createdAt) entity.createdAt = domain.createdAt;
    return entity;
  }
}
