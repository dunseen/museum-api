import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Taxon } from '../../domain/taxon';

export abstract class TaxonRepository {
  abstract create(
    data: Omit<Taxon, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Taxon>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Taxon>>;

  abstract findById(id: Taxon['id']): Promise<NullableType<Taxon>>;

  abstract update(
    id: Taxon['id'],
    payload: DeepPartial<Taxon>,
  ): Promise<Taxon | null>;

  abstract remove(id: Taxon['id']): Promise<void>;
  abstract countByHierarchy(name: string): Promise<number>;
}
