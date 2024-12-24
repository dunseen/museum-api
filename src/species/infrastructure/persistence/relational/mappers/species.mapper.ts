import { species } from '../../../../domain/species';
import { speciesEntity } from '../entities/species.entity';

export class speciesMapper {
  static toDomain(raw: speciesEntity): species {
    const domainEntity = new species();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: species): speciesEntity {
    const persistenceEntity = new speciesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
