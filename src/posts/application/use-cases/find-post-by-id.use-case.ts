import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../../domain/post';
import { PostService } from '../../domain/post.service';
import { PostFactory } from '../../domain/post.factory';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.error';

@Injectable()
export class FindPostByIdUseCase {
  constructor(private readonly postService: PostService) {}

  async execute(id: Post['id']) {
    try {
      const post = await this.postService.ensurePostExists(id);

      return PostFactory.toDto(post);
    } catch (error) {
      if (error instanceof PostNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
