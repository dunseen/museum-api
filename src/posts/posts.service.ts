import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Post } from './domain/post';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { PostStatusEnum } from './post-status.enum';
import { SpeciesService } from '../species/species.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly specieService: SpeciesService,
  ) {}

  async create(createPostDto: CreatePostDto, payload: JwtPayloadType) {
    const post = new Post();
    const specie = await this.specieService.findOne(createPostDto.specieId);

    const author = await this.userRepository.findById(payload.id);

    if (!author) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Unauthorized to create a post',
      });
    }

    post.specie = specie;
    post.author = author;
    post.status = PostStatusEnum.pending;

    return this.postRepository.create(post);
  }

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

  async findOne(id: Post['id']) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'Post not found',
      });
    }

    return post;
  }

  async update(
    id: Post['id'],
    updatePostDto: UpdatePostDto,
    payload: JwtPayloadType,
  ) {
    const post = await this.findOne(id);

    const validator = await this.userRepository.findById(payload.id);

    if (!validator) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Unauthorized to create a post',
      });
    }

    if (updatePostDto?.rejectReason) {
      post.reject_reason = updatePostDto.rejectReason;
      post.status = PostStatusEnum.rejected;
    } else {
      post.status = PostStatusEnum.published;
      post.reject_reason = null;
    }

    post.validator = validator;

    await this.postRepository.update(id, post);
  }

  remove(id: Post['id']) {
    return this.postRepository.remove(id);
  }
}
