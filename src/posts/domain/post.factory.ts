import { SpecieFactory } from '../../species/domain/specie.factory';
import { UserFactory } from '../../users/domain/user.factory';
import { GetPostDetailsDto, ListHomePagePostsDto } from '../application/dtos';
import { GetPostDto } from '../application/dtos/get-post.dto';
import { Post } from './post';

export class PostFactory {
  static toDto(post: Post): GetPostDto {
    return {
      id: post.id,
      status: post.status,
      rejectReason: post.rejectReason,
      author: UserFactory.createAuthor(post.author),
      validator: post.validator
        ? UserFactory.createAuthor(post.validator)
        : null,
      specie: SpecieFactory.toDto(post.species[0]),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toPostDetailsDto(post: Post): GetPostDetailsDto {
    return {
      id: post.id,
      specie: SpecieFactory.toDto(post.species[0]),
      createdAt: post.createdAt,
    };
  }

  static toListHomePageDto(post: Post): ListHomePagePostsDto {
    return {
      id: post.id,
      specie: SpecieFactory.toListHomePageDto(post.species[0]),
    };
  }
}
