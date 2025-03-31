import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Specie } from '../../domain/specie';

export abstract class SpecieRepository {
  abstract create(
    data: Omit<Specie, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Specie>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Specie>>;

  abstract findById(id: Specie['id']): Promise<NullableType<Specie>>;
  abstract findByScientificName(
    id: Specie['scientificName'],
  ): Promise<NullableType<Specie>>;

  abstract update(
    id: Specie['id'],
    payload: DeepPartial<Specie>,
  ): Promise<void>;

  abstract remove(id: Specie['id']): Promise<void>;

  abstract count(): Promise<number>;
}
