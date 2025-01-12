import { Injectable } from '@nestjs/common';
import { Post } from '../../domain/post';
import { PostRepository } from '../../domain/post.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: Post['id']) {
    await this.postRepository.remove(id);
  }
}
