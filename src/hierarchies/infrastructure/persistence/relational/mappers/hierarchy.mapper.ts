import { Hierarchy } from '../../../../domain/hierarchy';
import { HierarchyEntity } from '../entities/hierarchy.entity';

export class HierarchyMapper {
  static toDomain(raw: HierarchyEntity): Hierarchy {
    const domainEntity = new Hierarchy();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Hierarchy): HierarchyEntity {
    const persistenceEntity = new HierarchyEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
