import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Specialist } from '../../domain/specialist';

export abstract class SpecialistRepository {
  abstract create(
    data: Omit<Specialist, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Specialist>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Specialist>>;

  abstract findById(id: Specialist['id']): Promise<NullableType<Specialist>>;

  abstract findByName(
    name: Specialist['name'],
  ): Promise<NullableType<Specialist>>;

  abstract update(
    id: Specialist['id'],
    payload: DeepPartial<Specialist>,
  ): Promise<Specialist | null>;

  abstract remove(id: Specialist['id']): Promise<void>;
}
