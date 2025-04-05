import { JwtPayloadType } from '../../../auth/strategies/types/jwt-payload.type';
import { SpeciesService } from '../../../species/species.service';
import { UsersService } from '../../../users/users.service';
import { PostRepository } from '../../domain/post.repository';
import { Post } from '../../domain/post';
import { PostStatusEnum } from '../../domain/post-status.enum';
import { PostFactory } from '../../domain/post.factory';
import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => SpeciesService))
    private readonly speciesService: SpeciesService,
  ) {}

  async execute(createPostDto: CreatePostDto, payload: JwtPayloadType) {
    const specie = await this.speciesService.findOne(createPostDto.specieId);

    if (!specie) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'Notfound specie to create a post',
      });
    }

    const author = await this.userService.findById(payload.id);

    if (!author) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unauthorized to create a post',
      });
    }

    const post = Post.builder()
      .setId()
      .setSpecie([specie])
      .setAuthor(author)
      .setStatus(PostStatusEnum.pending)
      .build();

    const newPost = await this.postRepository.create(post);

    return PostFactory.toDto(newPost);
  }
}
