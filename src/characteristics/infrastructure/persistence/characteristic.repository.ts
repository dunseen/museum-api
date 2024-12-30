import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Characteristic } from '../../domain/characteristic';

export abstract class CharacteristicRepository {
  abstract create(
    data: Omit<Characteristic, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Characteristic>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Characteristic>>;

  abstract findById(
    id: Characteristic['id'],
  ): Promise<NullableType<Characteristic>>;

  abstract findByName(
    id: Characteristic['name'],
  ): Promise<NullableType<Characteristic>>;

  abstract update(
    id: Characteristic['id'],
    payload: DeepPartial<Characteristic>,
  ): Promise<Characteristic | null>;

  abstract remove(id: Characteristic['id']): Promise<void>;
}
