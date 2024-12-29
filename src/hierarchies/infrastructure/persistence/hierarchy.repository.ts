import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';

import { Hierarchy } from '../../domain/hierarchy';

export abstract class HierarchyRepository {
  abstract create(
    data: Omit<Hierarchy, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Hierarchy>;

  abstract findById(id: Hierarchy['id']): Promise<NullableType<Hierarchy>>;
  abstract findAll(): Promise<Hierarchy[]>;
  abstract update(
    id: Hierarchy['id'],
    payload: DeepPartial<Hierarchy>,
  ): Promise<Hierarchy | null>;

  abstract remove(id: Hierarchy['id']): Promise<void>;
}
