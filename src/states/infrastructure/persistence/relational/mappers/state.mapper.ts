import { State } from '../../../../domain/state';
import { StateEntity } from '../entities/state.entity';

export class StateMapper {
  static toDomain(raw: StateEntity): State {
    const domainEntity = new State();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;

    return domainEntity;
  }

  static toPersistence(domainEntity: State): StateEntity {
    const persistenceEntity = new StateEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;

    return persistenceEntity;
  }
}
