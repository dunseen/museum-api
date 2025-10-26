import { SelectQueryBuilder } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostStatusEnum } from '../../../domain/post-status.enum';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

export class PostQueryBuilder {
  private query: SelectQueryBuilder<PostEntity>;

  constructor(query: SelectQueryBuilder<PostEntity>) {
    this.query = query;
  }

  withChangeRequest() {
    this.query = this.query.leftJoinAndSelect(
      'p.changeRequest',
      'changeRequest',
    );

    this.query = this.query.leftJoinAndSelect(
      'changeRequest.proposedBy',
      'proposedBy',
    );

    this.query = this.query.leftJoinAndSelect(
      'changeRequest.reviewedBy',
      'reviewedBy',
    );
    return this;
  }

  withCollector() {
    this.query = this.query.leftJoinAndSelect('s.collector', 'collector');
    return this;
  }

  withDeterminator() {
    this.query = this.query.leftJoinAndSelect('s.determinator', 'determinator');
    return this;
  }

  withSpecies() {
    this.query = this.query.innerJoinAndSelect('p.specie', 's');
    return this;
  }

  withCharacteristics() {
    this.query = this.query.leftJoinAndSelect('s.characteristics', 'c');
    return this;
  }

  withCharacteristicTypes() {
    this.query = this.query.leftJoinAndSelect('c.type', 'type');
    return this;
  }

  withCharacteristicFiles() {
    this.query = this.query.leftJoinAndSelect('c.files', 'cf');
    return this;
  }

  withFiles() {
    this.query = this.query.leftJoinAndSelect('s.files', 'f');
    this.query.andWhere('f.approved = true');
    return this;
  }

  withTaxons() {
    this.query = this.query
      .innerJoinAndSelect('s.taxons', 't')
      .leftJoinAndSelect('t.characteristics', 'tc')
      .leftJoinAndSelect('tc.type', 'tct');
    return this;
  }

  withCityAndState() {
    this.query = this.query
      .leftJoinAndSelect('s.city', 'city')
      .leftJoinAndSelect('s.state', 'state');
    return this;
  }

  withHierarchy() {
    this.query = this.query.innerJoinAndSelect('t.hierarchy', 'h');
    return this;
  }

  withStatus(status: PostStatusEnum) {
    this.query = this.query.andWhere('p.status = :status', { status });
    return this;
  }

  withPagination(paginationOptions: IPaginationOptions) {
    this.query = this.query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit);
    return this;
  }

  withNameFilter(name: string) {
    this.query = this.query.andWhere(
      'LOWER(s.scientificName) LIKE LOWER(:name) OR LOWER(s.commonName) LIKE LOWER(:name)',
      { name: `%${name}%` },
    );
    return this;
  }

  withTaxonAndHierarchyFilter(hierarchyId: number, taxonName: string) {
    const subQuery = this.query
      .subQuery()
      .select('p.id')
      .from(PostEntity, 'p')
      .innerJoin('p.species', 's')
      .innerJoin('s.taxons', 't')
      .innerJoin('t.hierarchy', 'h')
      .where('h.id = :hierarchyId AND LOWER(t.name) LIKE LOWER(:taxonName)', {
        hierarchyId,
        taxonName: `%${taxonName}%`,
      })
      .andWhere('p.status = :status', { status: PostStatusEnum.published });

    this.query = this.query.andWhere(
      `p.id IN (${subQuery.getQuery()})`,
      subQuery.getParameters(),
    );

    return this;
  }

  withCharacteristicIds(ids: number[]) {
    this.query = this.query.andWhere(
      'c.id IN (:...ids) OR tc.id IN (:...ids)',
      { ids },
    );
    return this;
  }

  build() {
    return this.query;
  }
}
