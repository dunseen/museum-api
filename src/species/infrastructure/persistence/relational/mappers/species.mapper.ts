import { Species } from '../../../../domain/species';
import { SpeciesEntity } from '../entities/species.entity';

export class SpeciesMapper {
  static toDomain(raw: SpeciesEntity): Species {
    const domainEntity = new Species();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Species): SpeciesEntity {
    const persistenceEntity = new SpeciesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
