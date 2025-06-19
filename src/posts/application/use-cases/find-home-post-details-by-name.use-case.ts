import { Injectable } from '@nestjs/common';
import { PostFactory } from '../../domain/post.factory';
import { PostRepository } from '../../domain/post.repository';

@Injectable()
export class FindHomePostDetailsByNameUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(name: string) {
    const post = await this.postRepository.searchBySpecieName(name);

    if (!post) return null;

    return PostFactory.toPostDetailsDto(post);
  }
}
