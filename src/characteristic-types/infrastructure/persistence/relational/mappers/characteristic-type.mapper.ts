import { CharacteristicType } from '../../../../domain/characteristic-type';
import { CharacteristicTypeEntity } from '../entities/characteristic-type.entity';

export class CharacteristicTypeMapper {
  static toDomain(raw: CharacteristicTypeEntity): CharacteristicType {
    const domainEntity = new CharacteristicType();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(
    domainEntity: CharacteristicType,
  ): CharacteristicTypeEntity {
    const persistenceEntity = new CharacteristicTypeEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
