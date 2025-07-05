import { Injectable } from '@nestjs/common';
import { Post } from '../../domain/post';
import { PostRepository } from '../../domain/post.repository';
import { UsersService } from '../../../users/users.service';
import { JwtPayloadType } from '../../../auth/strategies/types/jwt-payload.type';
import { ChangeLogsService } from '../../../change-logs/change-logs.service';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    private readonly changeLogsService: ChangeLogsService,
  ) {}

  async execute(id: Post['id'], payload: JwtPayloadType) {
    const post = await this.postRepository.findById(id);
    await this.postRepository.remove(id);
    const changer = await this.userService.ensureUserExists(payload.id);
    await this.changeLogsService.create({
      tableName: 'post',
      action: 'delete',
      oldValue: post,
      newValue: null,
      changedBy: changer,
    });
  }
}
