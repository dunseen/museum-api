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
import { GetPostDto } from './dto/get-post.dto';
import { PostFactory } from './domain/post.factory';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly specieService: SpeciesService,
  ) {}

  async create(createPostDto: CreatePostDto, payload: JwtPayloadType) {
    const specie = await this.specieService.findOne(createPostDto.specieId);

    const author = await this.userRepository.findById(payload.id);

    if (!author) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Unauthorized to create a post',
      });
    }

    const post = Post.builder()
      .setSpecie(specie)
      .setAuthor(author)
      .setStatus(PostStatusEnum.pending)
      .build();

    const newPost = await this.postRepository.create(post);

    return PostFactory.toDto(newPost);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetPostDto[], number]> {
    const [posts, count] = await this.postRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });

    return [posts.map(PostFactory.toDto), count];
  }

  async findOne(id: Post['id']) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'Post not found',
      });
    }

    return PostFactory.toDto(post);
  }

  async update(
    id: Post['id'],
    updatePostDto: UpdatePostDto,
    payload: JwtPayloadType,
  ) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'Post not found',
      });
    }

    const validator = await this.userRepository.findById(payload.id);

    if (!validator) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Unauthorized to create a post',
      });
    }

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
  }

  remove(id: Post['id']) {
    return this.postRepository.remove(id);
  }
}
