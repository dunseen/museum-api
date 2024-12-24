import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { species } from '../../domain/species';

export abstract class speciesRepository {
  abstract create(
    data: Omit<species, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<species>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<species[]>;

  abstract findById(id: species['id']): Promise<NullableType<species>>;

  abstract update(
    id: species['id'],
    payload: DeepPartial<species>,
  ): Promise<species | null>;

  abstract remove(id: species['id']): Promise<void>;
}
