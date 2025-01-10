import { CharacteristicType } from '../../../../../characteristic-types/domain/characteristic-type';
import { CharacteristicTypeEntity } from '../../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
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
      raw.description,
      type,
      raw.files,
      raw.createdAt,
      raw.updatedAt,
      raw.id,
    );

    return domainEntity;
  }

  static toPersistence(
    domainEntity: Partial<Characteristic>,
  ): CharacteristicEntity {
    const persistenceEntity = new CharacteristicEntity();
    const type = new CharacteristicTypeEntity();

    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    if (domainEntity?.type?.id) {
      type.id = Number(domainEntity.type.id);
    }

    if (domainEntity?.type?.name) {
      type.name = domainEntity.type.name;
    }

    if (domainEntity?.description) {
      persistenceEntity.description = domainEntity.description;
    }

    persistenceEntity.type = type;
    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }
}
