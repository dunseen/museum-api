import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Post } from '../../../../domain/post';
import { PostRepository } from '../../post.repository';
import { PostMapper } from '../mappers/post.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class PostRelationalRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(data: Post): Promise<Post> {
    const persistenceModel = PostMapper.toPersistence(data);
    const newEntity = await this.postRepository.save(
      this.postRepository.create(persistenceModel),
    );
    return PostMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Post>> {
    const [entities, totalCount] = await this.postRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return [entities.map((user) => PostMapper.toDomain(user)), totalCount];
  }

  async findById(id: Post['id']): Promise<NullableType<Post>> {
    const entity = await this.postRepository.findOne({
      where: { id },
    });

    return entity ? PostMapper.toDomain(entity) : null;
  }

  async update(id: Post['id'], payload: Partial<Post>): Promise<Post> {
    const entity = await this.postRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.postRepository.save(
      this.postRepository.create(
        PostMapper.toPersistence({
          ...PostMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PostMapper.toDomain(updatedEntity);
  }

  async remove(id: Post['id']): Promise<void> {
    await this.postRepository.delete(id);
  }
}
