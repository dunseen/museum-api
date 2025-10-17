import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { FileType } from '../../../../domain/file';
import { ChangeRequestEntity } from '../../../../../change-requests/infrastructure/persistence/relational/entities/change-request.entity';
import { FileEntity } from '../entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    domainEntity.url = raw.url;
    domainEntity.approved = raw.approved;
    return domainEntity;
  }

  static toPersistence(domainEntity: FileType): FileEntity {
    const persistenceEntity = new FileEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.path = domainEntity.path;
    persistenceEntity.url = domainEntity.url;
    persistenceEntity.approved = domainEntity.approved ?? false;

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

    if ((domainEntity as any).changeRequestId) {
      const cr = new ChangeRequestEntity();
      cr.id = (domainEntity as any).changeRequestId;
      persistenceEntity.changeRequest = cr;
    }

    return persistenceEntity;
  }
}
