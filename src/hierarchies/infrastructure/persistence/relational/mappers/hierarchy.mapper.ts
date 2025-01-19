import { Hierarchy } from '../../../../domain/hierarchy';
import { HierarchyEntity } from '../entities/hierarchy.entity';

export class HierarchyMapper {
  static toDomain(raw: HierarchyEntity): Hierarchy {
    const domainEntity = new Hierarchy();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;

    return domainEntity;
  }

  static toPersistence(domainEntity: Hierarchy): HierarchyEntity {
    const persistenceEntity = new HierarchyEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;

    return persistenceEntity;
  }
}
