import { CharacteristicMapper } from '../../../../../characteristics/infrastructure/persistence/relational/mappers/characteristic.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { TaxonMapper } from '../../../../../taxons/infrastructure/persistence/relational/mappers/taxon.mapper';
import { Specie } from '../../../../domain/specie';
import { SpecieBuilder } from '../../../../domain/specie-builder';
import { SpecieEntity } from '../entities/specie.entity';

export class SpecieMapper {
  static toDomain(raw: SpecieEntity): Specie {
    const domainEntity = new SpecieBuilder()
      .setId(raw.id)
      .setScientificName(raw.scientificName)
      .setCommonName(raw.commonName)
      .setUpdatedAt(raw.updatedAt)
      .setCreatedAt(raw.createdAt)
      .build();

    if (raw?.taxons?.length) {
      raw.taxons.forEach((tx) =>
        domainEntity.addTaxon(TaxonMapper.toDomain(tx)),
      );
    }

    if (raw?.characteristics) {
      raw.characteristics.forEach((ch) =>
        domainEntity.addCharacteristic(CharacteristicMapper.toDomain(ch)),
      );
    }

    if (raw?.files) {
      raw.files.forEach((f) => domainEntity.addFile(FileMapper.toDomain(f)));
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Partial<Specie>): SpecieEntity {
    const persistenceEntity = new SpecieEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    if (domainEntity?.characteristics?.length) {
      persistenceEntity.characteristics = domainEntity.characteristics.map(
        CharacteristicMapper.toPersistence,
      );
    }

    if (domainEntity?.files?.length) {
      persistenceEntity.files = domainEntity.files.map(
        FileMapper.toPersistence,
      );
    }

    if (domainEntity?.taxons?.length) {
      persistenceEntity.taxons = domainEntity.taxons.map(
        TaxonMapper.toPersistence,
      );
    }

    if (domainEntity?.scientificName) {
      persistenceEntity.scientificName = domainEntity.scientificName;
    }

    if (domainEntity?.commonName) {
      persistenceEntity.commonName = domainEntity.commonName;
    }

    if (domainEntity?.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }

    if (domainEntity?.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
