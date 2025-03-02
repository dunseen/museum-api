import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { FileType } from '../../../../domain/file';
import { FileEntity } from '../entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    domainEntity.url = raw.url;
    return domainEntity;
  }

  static toPersistence(domainEntity: FileType): FileEntity {
    const persistenceEntity = new FileEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.path = domainEntity.path;
    persistenceEntity.url = domainEntity.url;

    if (domainEntity.specieId) {
      const specie = new SpecieEntity();
      specie.id = domainEntity.specieId;
      persistenceEntity.specie = specie;
    }

    if (domainEntity.characteristicId) {
      const characteristic = new CharacteristicEntity();
      characteristic.id = domainEntity.characteristicId;
      persistenceEntity.characteristic = characteristic;
    }

    return persistenceEntity;
  }
}
