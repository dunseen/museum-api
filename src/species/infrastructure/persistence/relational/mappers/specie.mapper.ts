import { Specie } from '../../../../domain/specie';
import { SpecieEntity } from '../entities/specie.entity';

export class SpecieMapper {
  static toDomain(raw: SpecieEntity): Specie {
    const domainEntity = new Specie();
    domainEntity.id = raw.id;
    domainEntity.scientificName = raw.scientificName;
    domainEntity.commonName = raw.commonName;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Specie): SpecieEntity {
    const persistenceEntity = new SpecieEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.scientificName = domainEntity.scientificName;
    persistenceEntity.commonName = domainEntity.commonName;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
