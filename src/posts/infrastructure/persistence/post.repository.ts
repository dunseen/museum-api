import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../utils/types/pagination-options';
import { Post } from '../../domain/post';

export abstract class PostRepository {
  abstract create(
    data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Post>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Post>>;

  abstract findById(id: Post['id']): Promise<NullableType<Post>>;

  abstract update(
    id: Post['id'],
    payload: DeepPartial<Post>,
  ): Promise<Post | null>;

  abstract remove(id: Post['id']): Promise<void>;
}
