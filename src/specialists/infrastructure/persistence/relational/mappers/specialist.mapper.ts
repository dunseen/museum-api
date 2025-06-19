import { Specialist } from '../../../../domain/specialist';
import { SpecialistEntity } from '../entities/specialist.entity';

export class SpecialistMapper {
  static toDomain(raw: SpecialistEntity): Specialist {
    const domainEntity = new Specialist();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.type = raw.type;

    return domainEntity;
  }

  static toPersistence(domainEntity: Specialist): SpecialistEntity {
    const persistenceEntity = new SpecialistEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.type = domainEntity.type;

    return persistenceEntity;
  }
}
