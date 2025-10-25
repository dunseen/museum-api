import { FileType } from '../../../../domain/file';
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
    persistenceEntity.specieId = domainEntity.specieId ?? null;
    persistenceEntity.characteristicId = domainEntity.characteristicId ?? null;
    persistenceEntity.changeRequestId = domainEntity.changeRequestId ?? null;

    return persistenceEntity;
  }
}
