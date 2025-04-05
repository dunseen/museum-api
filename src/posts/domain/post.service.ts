import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { Post } from './post';
import { PostNotFoundException } from './exceptions/post-not-found.error';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.postRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async ensurePostExists(id: Post['id']) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }

  async invalidatePublishedPostsBySpecieId(id: number) {
    const posts = await this.postRepository.findPublishedBySpecieId(id);

    const ids = posts.map((p) => p.id);

    if (ids.length === 0) return;

    await this.remove(ids);
  }

  remove(id: string[] | string) {
    return this.postRepository.remove(id);
  }
}
