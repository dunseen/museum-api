import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Species } from '../../domain/species';

export abstract class SpeciesRepository {
  abstract create(
    data: Omit<Species, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Species>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Species>>;

  abstract findById(id: Species['id']): Promise<NullableType<Species>>;

  abstract update(
    id: Species['id'],
    payload: DeepPartial<Species>,
  ): Promise<Species | null>;

  abstract remove(id: Species['id']): Promise<void>;
}
