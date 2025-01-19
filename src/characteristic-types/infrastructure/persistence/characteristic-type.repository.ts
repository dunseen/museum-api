import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { CharacteristicType } from '../../domain/characteristic-type';

export abstract class CharacteristicTypeRepository {
  abstract create(
    data: Omit<CharacteristicType, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CharacteristicType>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<CharacteristicType>>;

  abstract findAll(limit?: number): Promise<CharacteristicType[]>;

  abstract findById(
    id: CharacteristicType['id'],
  ): Promise<NullableType<CharacteristicType>>;

  abstract findByName(
    id: CharacteristicType['name'],
  ): Promise<NullableType<CharacteristicType>>;

  abstract update(
    id: CharacteristicType['id'],
    payload: DeepPartial<CharacteristicType>,
  ): Promise<CharacteristicType | null>;

  abstract remove(id: CharacteristicType['id']): Promise<void>;
}
