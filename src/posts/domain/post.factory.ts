import { SpecieFactory } from '../../species/domain/specie.factory';
import { UserFactory } from '../../users/domain/user.factory';
import { GetPostDto } from '../dto/get-post.dto';
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
      specie: SpecieFactory.toDto(post.specie),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
