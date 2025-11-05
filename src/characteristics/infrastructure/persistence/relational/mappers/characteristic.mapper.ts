import { CharacteristicType } from '../../../../../characteristic-types/domain/characteristic-type';
import { CharacteristicTypeMapper } from '../../../../../characteristic-types/infrastructure/persistence/relational/mappers/characteristic-type.mapper';
import { Characteristic } from '../../../../domain/characteristic';
import { CharacteristicEntity } from '../entities/characteristic.entity';

export class CharacteristicMapper {
  static toDomain(raw: CharacteristicEntity): Characteristic {
    const type = CharacteristicType.create(
      raw.type.name,
      raw.type.id,
      raw.type.createdAt,
      raw.type.updatedAt,
    );

    const domainEntity = Characteristic.create(
      raw.name,
      type,
      raw.files,
      raw.createdAt,
      raw.updatedAt,
      raw.id,
    );

    return domainEntity;
  }

  static toPersistence(domainEntity: Characteristic): CharacteristicEntity {
    const persistenceEntity = new CharacteristicEntity();

    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    if (domainEntity?.type) {
      persistenceEntity.type = CharacteristicTypeMapper.toPersistence(
        domainEntity.type,
      );
    }

    if (domainEntity?.name) {
      persistenceEntity.name = domainEntity.name;
    }

    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
