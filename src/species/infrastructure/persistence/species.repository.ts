import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Species } from '../../domain/species';

export abstract class speciesRepository {
  abstract create(
    data: Omit<Species, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Species>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Species[]>;

  abstract findById(id: Species['id']): Promise<NullableType<Species>>;

  abstract update(
    id: Species['id'],
    payload: DeepPartial<Species>,
  ): Promise<Species | null>;

  abstract remove(id: Species['id']): Promise<void>;
}
