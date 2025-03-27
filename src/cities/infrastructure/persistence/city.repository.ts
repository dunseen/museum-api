import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';

import { City } from '../../domain/city';

export abstract class CityRepository {
  abstract create(
    data: Omit<City, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<City>;

  abstract findAll(stateId?: number): Promise<City[]>;

  abstract findById(id: City['id']): Promise<NullableType<City>>;

  abstract update(
    id: City['id'],
    payload: DeepPartial<City>,
  ): Promise<City | null>;

  abstract remove(id: City['id']): Promise<void>;
}
