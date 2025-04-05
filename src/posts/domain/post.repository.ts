import { DeepPartial } from '../../utils/types/deep-partial.type';
import { NullableType } from '../../utils/types/nullable.type';
import {
  IPaginationOptions,
  WithCountList,
} from '../../utils/types/pagination-options';
import { ListHomePagePostsDto } from '../application/dtos';
import { Post } from './post';

export abstract class PostRepository {
  abstract create(
    data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Post>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Post>>;
  abstract findAllHomePageWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<ListHomePagePostsDto>>;

  abstract findById(id: Post['id']): Promise<NullableType<Post>>;
  abstract searchBySpecieName(name: string): Promise<NullableType<Post>>;
  abstract findPublishedBySpecieId(id: number): Promise<Post[]>;

  abstract update(id: Post['id'], payload: DeepPartial<Post>): Promise<void>;

  abstract remove(id: string[] | string): Promise<void>;
}
