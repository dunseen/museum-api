import { StateMapper } from '../../../../../states/infrastructure/persistence/relational/mappers/state.mapper';
import { City } from '../../../../domain/city';
import { CityEntity } from '../entities/city.entity';

export class CityMapper {
  static toDomain(raw: CityEntity): City {
    const domainEntity = new City();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.state = raw.state;

    return domainEntity;
  }

  static toPersistence(domainEntity: City): CityEntity {
    const persistenceEntity = new CityEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.state = StateMapper.toPersistence(domainEntity.state);

    return persistenceEntity;
  }
}
