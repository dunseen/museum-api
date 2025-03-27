import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';

import { State } from '../../domain/state';

export abstract class StateRepository {
  abstract create(
    data: Omit<State, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<State>;

  abstract findAll(): Promise<State[]>;

  abstract findById(id: State['id']): Promise<NullableType<State>>;

  abstract update(
    id: State['id'],
    payload: DeepPartial<State>,
  ): Promise<State | null>;

  abstract remove(id: State['id']): Promise<void>;
}
