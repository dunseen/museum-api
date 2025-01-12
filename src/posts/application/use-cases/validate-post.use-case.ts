import { JwtPayloadType } from '../../../auth/strategies/types/jwt-payload.type';
import { UsersService } from '../../../users/users.service';
import { PostRepository } from '../../domain/post.repository';
import { Post } from '../../domain/post';
import { PostStatusEnum } from '../../domain/post-status.enum';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../../domain/post.service';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.error';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.error';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class ValidatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    private readonly postService: PostService,
  ) {}

  async execute(
    id: Post['id'],
    updatePostDto: UpdatePostDto,
    payload: JwtPayloadType,
  ) {
    try {
      const post = await this.postService.ensurePostExists(id);

      const validator = await this.userService.ensureUserExists(payload.id);

      if (updatePostDto?.rejectReason) {
        post.updateStatus(
          PostStatusEnum.rejected,
          validator,
          updatePostDto.rejectReason,
        );
      } else {
        post.updateStatus(PostStatusEnum.pending, validator, null);
      }

      await this.postRepository.update(id, post);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof PostNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
