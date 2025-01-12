import { Injectable } from '@nestjs/common';
import { infinityPagination } from '../../../utils/infinity-pagination';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PostRepository } from '../../domain/post.repository';

@Injectable()
export class ListHomePagePostsUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    const result = await this.postRepository.findAllHomePageWithPagination({
      paginationOptions,
    });

    return infinityPagination(result, { ...paginationOptions });
  }
}
