import { CharacteristicType } from '../../../../domain/characteristic-type';
import { CharacteristicTypeEntity } from '../entities/characteristic-type.entity';

export class CharacteristicTypeMapper {
  static toDomain(raw: CharacteristicTypeEntity): CharacteristicType {
    const domainEntity = CharacteristicType.create(
      raw.name,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );

    return domainEntity;
  }

  static toPersistence(
    domainEntity: Partial<CharacteristicType>,
  ): CharacteristicTypeEntity {
    const persistenceEntity = new CharacteristicTypeEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }

    if (domainEntity.name) {
      persistenceEntity.name = domainEntity.name;
    }

    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
