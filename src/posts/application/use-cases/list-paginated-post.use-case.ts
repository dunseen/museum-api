import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PostFactory } from '../../domain/post.factory';
import { PostService } from '../../domain/post.service';
import { GetPostDto } from '../dtos/get-post.dto';

@Injectable()
export class ListPaginatedPostUseCase {
  constructor(private readonly postService: PostService) {}

  async execute({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetPostDto[], number]> {
    const [posts, count] = await this.postService.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });

    return [posts.map(PostFactory.toDto), count];
  }
}
