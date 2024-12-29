import { HierarchyEntity } from '../../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { Taxon } from '../../../../domain/taxon';
import { TaxonEntity } from '../entities/taxon.entity';

export class TaxonMapper {
  static toDomain(raw: TaxonEntity): Taxon {
    const domainEntity = new Taxon();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.hierarchy = raw.hierarchy;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.parent = raw.parent;

    return domainEntity;
  }

  static toPersistence(domainEntity: Taxon): TaxonEntity {
    let parent: TaxonEntity | null = null;
    const hierarchy = new HierarchyEntity();

    const persistenceEntity = new TaxonEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }

    if (domainEntity.parent) {
      parent = new TaxonEntity();
      parent.id = Number(domainEntity.parent.id);
    }

    if (domainEntity.hierarchy) {
      hierarchy.id = Number(domainEntity.hierarchy.id);
    }

    persistenceEntity.parent = parent;
    persistenceEntity.hierarchy = hierarchy;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
