import { CharacteristicTypeEntity } from '../../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { Characteristic } from '../../../../domain/characteristic';
import { CharacteristicEntity } from '../entities/characteristic.entity';

export class CharacteristicMapper {
  static toDomain(raw: CharacteristicEntity): Characteristic {
    const domainEntity = new Characteristic();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.type = raw.type;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Characteristic): CharacteristicEntity {
    const persistenceEntity = new CharacteristicEntity();
    const type = new CharacteristicTypeEntity();

    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    if (domainEntity.type.id) {
      type.id = Number(domainEntity.type.id);
    }

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.type = type;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
