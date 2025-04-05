import { CharacteristicMapper } from '../../../../../characteristics/infrastructure/persistence/relational/mappers/characteristic.mapper';
import { CityMapper } from '../../../../../cities/infrastructure/persistence/relational/mappers/city.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { StateMapper } from '../../../../../states/infrastructure/persistence/relational/mappers/state.mapper';
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
      .setDescription(raw.description)
      .setCity(raw.city)
      .setState(raw.state && StateMapper.toDomain(raw.state))
      .setLocation(raw.location)
      .setLat(raw.lat)
      .setLong(raw.long)
      .setCollectedAt(raw.collectedAt)
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

    persistenceEntity.characteristics = domainEntity?.characteristics?.length
      ? domainEntity.characteristics.map(CharacteristicMapper.toPersistence)
      : [];

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

    if (domainEntity?.description) {
      persistenceEntity.description = domainEntity.description;
    }

    if (domainEntity?.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }

    if (domainEntity?.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    if (domainEntity?.collectedAt) {
      persistenceEntity.collectedAt = domainEntity.collectedAt;
    }

    if (domainEntity?.state) {
      persistenceEntity.state = StateMapper.toPersistence(domainEntity.state);
    }

    if (domainEntity?.city) {
      persistenceEntity.city = CityMapper.toPersistence(domainEntity.city);
    }

    if (domainEntity?.lat) {
      persistenceEntity.lat = domainEntity.lat;
    }

    if (domainEntity?.long) {
      persistenceEntity.long = domainEntity.long;
    }

    if (domainEntity?.location) {
      persistenceEntity.location = domainEntity.location;
    }

    return persistenceEntity;
  }
}
