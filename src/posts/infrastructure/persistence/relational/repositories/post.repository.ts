import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Post } from '../../../../domain/post';
import { PostRepository } from '../../../../domain/post.repository';
import { PostMapper } from '../mappers/post.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';
import { ListHomePagePostsDto } from '../../../../application/dtos';
import { PostSimplifiedMapper } from '../mappers/post-simplified.mapper';
import { PostStatusEnum } from '../../../../domain/post-status.enum';

@Injectable()
export class PostRelationalRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async findPublishedBySpecieId(specieId: number): Promise<Post[]> {
    const query = this.postRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.author', 'author')
      .leftJoin('p.validator', 'validator')
      .innerJoinAndSelect('p.species', 's')
      .where('s.id = :specieId', {
        specieId,
      })
      .andWhere('p.status = :status', {
        status: PostStatusEnum.published,
      });

    const post = await query.getMany();

    return post.map(PostMapper.toDomain);
  }
  async searchBySpecieName(name: string): Promise<NullableType<Post>> {
    const query = this.postRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.author', 'author')
      .leftJoin('p.validator', 'validator')
      .innerJoinAndSelect('p.species', 's')
      .leftJoinAndSelect('s.files', 'f')
      .innerJoinAndSelect('s.taxons', 't')
      .innerJoinAndSelect('s.characteristics', 'c')
      .innerJoinAndSelect('c.files', 'f2')
      .leftJoinAndSelect('s.city', 'city')
      .leftJoinAndSelect('s.state', 'state')
      .innerJoinAndSelect('c.type', 'type')
      .innerJoinAndSelect('t.hierarchy', 'h')
      .where(
        'LOWER(s.scientificName) = LOWER(:name) OR LOWER(s.commonName) = LOWER(:name)',
        {
          name,
        },
      )
      .andWhere('p.status = :status', {
        status: PostStatusEnum.published,
      });

    const post = await query.getOne();

    return post ? PostMapper.toDomain(post) : null;
  }

  async findAllHomePageWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<ListHomePagePostsDto>> {
    const query = this.postRepository
      .createQueryBuilder('p')
      .select(['p.id', 'p.createdAt'])
      .innerJoinAndSelect('p.species', 's')
      .leftJoinAndSelect('s.characteristics', 'c')
      .leftJoinAndSelect('c.type', 'type')
      .leftJoinAndSelect('s.files', 'f')
      .innerJoinAndSelect('s.taxons', 't')
      .leftJoinAndSelect('s.city', 'city')
      .leftJoinAndSelect('s.state', 'state')
      .innerJoinAndSelect('t.hierarchy', 'h')
      .where('p.status = :status', {
        status: PostStatusEnum.published,
      })
      .orderBy('p.createdAt', 'DESC')
      .addOrderBy('s.scientificName', 'ASC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    if (paginationOptions.filters?.name) {
      query.andWhere(
        'LOWER(s.scientificName) LIKE LOWER(:name) OR LOWER(s.commonName) LIKE LOWER(:name)',
        {
          name: `%${paginationOptions.filters.name}%`,
        },
      );
    }

    if (paginationOptions.filters?.family) {
      query.andWhere(
        'LOWER(h.name) = :hierarchyFamily AND LOWER(t.name) LIKE LOWER(:family)',
        {
          hierarchyFamily: 'family',
          family: `%${paginationOptions.filters.family}%`,
        },
      );
    }

    if (paginationOptions.filters?.genus) {
      query.andWhere(
        'LOWER(h.name) = :hierarchyGenus AND LOWER(t.name) LIKE LOWER(:genus)',
        {
          hierarchyGenus: 'genus',
          genus: `%${paginationOptions.filters.genus}%`,
        },
      );
    }

    if (paginationOptions.filters?.characteristicIds?.length) {
      query.andWhere('c.id IN (:...ids)', {
        ids: paginationOptions.filters.characteristicIds,
      });
    }

    const [entities, totalCount] = await query.getManyAndCount();

    return [entities.map(PostSimplifiedMapper.toDomain), totalCount];
  }

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
    const query = this.postRepository
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.species', 's')
      .leftJoinAndSelect('p.author', 'author')
      .leftJoinAndSelect('p.validator', 'validator')
      .leftJoinAndSelect('s.characteristics', 'c')
      .leftJoinAndSelect('c.type', 'type')
      .leftJoinAndSelect('s.files', 'f')
      .innerJoinAndSelect('s.taxons', 't')
      .leftJoinAndSelect('s.city', 'city')
      .leftJoinAndSelect('s.state', 'state')
      .innerJoinAndSelect('t.hierarchy', 'h')
      .orderBy('p.updatedAt', 'DESC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);

    if (paginationOptions.filters?.name) {
      query.andWhere(
        'LOWER(s.scientificName) LIKE LOWER(:name) OR LOWER(s.commonName) LIKE LOWER(:name)',
        {
          name: `%${paginationOptions.filters.name}%`,
        },
      );
    }

    if (paginationOptions.filters?.family) {
      query.andWhere(
        'LOWER(h.name) = :hierarchyFamily AND LOWER(t.name) LIKE LOWER(:family)',
        {
          hierarchyFamily: 'family',
          family: `%${paginationOptions.filters.family}%`,
        },
      );
    }

    if (paginationOptions.filters?.genus) {
      query.andWhere(
        'LOWER(h.name) = :hierarchyGenus AND LOWER(t.name) LIKE LOWER(:genus)',
        {
          hierarchyGenus: 'genus',
          genus: `%${paginationOptions.filters.genus}%`,
        },
      );
    }

    if (paginationOptions.filters?.characteristicIds?.length) {
      query.andWhere('c.id IN (:...ids)', {
        ids: paginationOptions.filters.characteristicIds,
      });
    }

    const [entities, totalCount] = await query.getManyAndCount();

    return [entities.map(PostMapper.toDomain), totalCount];
  }

  async findById(id: Post['id']): Promise<NullableType<Post>> {
    const entity = await this.postRepository.findOne({
      where: { id },
    });

    return entity ? PostMapper.toDomain(entity) : null;
  }

  async update(id: Post['id'], payload: Partial<Post>): Promise<void> {
    await this.postRepository.save(
      PostMapper.toPersistence({
        id,
        author: payload.author,
        validator: payload.validator,
        species: payload.species,
        status: payload.status,
        rejectReason: payload.rejectReason,
        updatedAt: payload.updatedAt,
        createdAt: payload.createdAt,
      }),
    );
  }

  async remove(id: string[] | string): Promise<void> {
    await this.postRepository.softDelete(id);
  }
}
