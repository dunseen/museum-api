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
import { PostQueryBuilder } from '../post-query.builder';

@Injectable()
export class PostRelationalRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findPublishedBySpecieId(specieId: number): Promise<Post[]> {
    const queryBuilder = new PostQueryBuilder(
      this.postRepository.createQueryBuilder('p'),
    )
      .withAuthor()
      .withValidator()
      .withSpecies()
      .withStatus(PostStatusEnum.published)
      .build();

    queryBuilder.where('s.id = :specieId', { specieId });

    const post = await queryBuilder.getMany();

    return post.map(PostMapper.toDomain);
  }

  async searchBySpecieName(name: string): Promise<NullableType<Post>> {
    const queryBuilder = new PostQueryBuilder(
      this.postRepository.createQueryBuilder('p'),
    )
      .withAuthor()
      .withValidator()
      .withSpecies()
      .withCollector()
      .withDeterminator()
      .withFiles()
      .withTaxons()
      .withCharacteristics()
      .withCharacteristicFiles()
      .withCharacteristicTypes()
      .withCityAndState()
      .withHierarchy()
      .withStatus(PostStatusEnum.published)
      .withNameFilter(name)
      .build();

    const post = await queryBuilder.getOne();

    return post ? PostMapper.toDomain(post) : null;
  }

  async findAllHomePageWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<ListHomePagePostsDto>> {
    const queryBuilder = new PostQueryBuilder(
      this.postRepository.createQueryBuilder('p'),
    )
      .withSpecies()
      .withCharacteristics()
      .withCharacteristicTypes()
      .withTaxons()
      .withHierarchy()
      .withFiles()
      .withCityAndState()
      .withStatus(PostStatusEnum.published)
      .withPagination(paginationOptions);

    if (paginationOptions.filters?.name) {
      queryBuilder.withNameFilter(paginationOptions.filters?.name);
    }

    if (
      paginationOptions.filters?.orderHierarchyId &&
      paginationOptions.filters.orderName
    ) {
      queryBuilder.withTaxonAndHierarchyFilter(
        paginationOptions.filters.orderHierarchyId,
        paginationOptions.filters.orderName,
      );
    }

    if (
      paginationOptions.filters?.familyHierarchyId &&
      paginationOptions.filters.familyName
    ) {
      queryBuilder.withTaxonAndHierarchyFilter(
        paginationOptions.filters.familyHierarchyId,
        paginationOptions.filters.familyName,
      );
    }

    if (
      paginationOptions.filters?.genusHierarchyId &&
      paginationOptions.filters.genusName
    ) {
      queryBuilder.withTaxonAndHierarchyFilter(
        paginationOptions.filters.genusHierarchyId,
        paginationOptions.filters.genusName,
      );
    }

    if (paginationOptions.filters?.characteristicIds?.length) {
      queryBuilder.withCharacteristicIds(
        paginationOptions.filters.characteristicIds.map(Number),
      );
    }

    const [entities, totalCount] = await queryBuilder
      .build()
      .orderBy('p.createdAt', 'DESC')
      .addOrderBy('s.scientificName', 'ASC')
      .getManyAndCount();

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
    const queryBuilder = new PostQueryBuilder(
      this.postRepository.createQueryBuilder('p'),
    )
      .withSpecies()
      .withAuthor()
      .withValidator()
      .withCharacteristics()
      .withCharacteristicTypes()
      .withFiles()
      .withTaxons()
      .withCityAndState()
      .withHierarchy()
      .withPagination(paginationOptions);

    if (paginationOptions.filters?.name) {
      queryBuilder.withNameFilter(paginationOptions.filters.name);
    }

    if (paginationOptions.filters?.characteristicIds?.length) {
      queryBuilder.withCharacteristicIds(
        paginationOptions.filters.characteristicIds.map(Number),
      );
    }

    const [entities, totalCount] = await queryBuilder
      .build()
      .orderBy('p.updatedAt', 'DESC')
      .getManyAndCount();

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
