import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxonEntity } from '../entities/taxon.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Taxon } from '../../../../domain/taxon';
import { TaxonRepository } from '../../taxon.repository';
import { TaxonMapper } from '../mappers/taxon.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class TaxonRelationalRepository implements TaxonRepository {
  constructor(
    @InjectRepository(TaxonEntity)
    private readonly taxonRepository: Repository<TaxonEntity>,
  ) {}

  countByHierarchy(name: string): Promise<number> {
    const query = this.taxonRepository
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.hierarchy', 'h')
      .where('h.name = :name', { name });

    return query.getCount();
  }

  async create(data: Taxon): Promise<Taxon> {
    const persistenceModel = TaxonMapper.toPersistence(data);

    const newEntity = await this.taxonRepository.save(
      this.taxonRepository.create(persistenceModel),
    );
    return TaxonMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Taxon>> {
    const query = this.taxonRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.characteristics', 'characteristics')
      .leftJoinAndSelect('characteristics.type', 'type')
      .leftJoinAndSelect('t.hierarchy', 'hierarchy')
      .leftJoinAndSelect('t.parent', 'parent')
      .leftJoinAndSelect('parent.hierarchy', 'parentHierarchy');

    if (paginationOptions.filters?.name) {
      query.where('LOWER(t.name) LIKE LOWER(:name) ', {
        name: `%${paginationOptions.filters.name}%`,
      });
    }

    if (paginationOptions.filters?.hierarchyId) {
      query.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('t2."hierarchyId"')
          .from('taxon', 't')
          .innerJoin('taxon', 't2', 't2.id = t."parentId"')
          .innerJoin('hierarchy', 'h', 't."hierarchyId" = h.id')
          .where('t."hierarchyId" = :hierarchyId', {
            hierarchyId: paginationOptions?.filters?.hierarchyId,
          })
          .getQuery();

        return 't."hierarchyId" IN ' + subQuery;
      });
    }

    const [entities, totalCount] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .orderBy('t.createdAt', 'DESC')
      .getManyAndCount();

    return [entities.map((user) => TaxonMapper.toDomain(user)), totalCount];
  }

  async findById(id: Taxon['id']): Promise<NullableType<Taxon>> {
    const entity = await this.taxonRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? TaxonMapper.toDomain(entity) : null;
  }

  async update(id: Taxon['id'], payload: Partial<Taxon>): Promise<Taxon> {
    const entity = await this.taxonRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.taxonRepository.save(
      this.taxonRepository.create(
        TaxonMapper.toPersistence({
          ...TaxonMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TaxonMapper.toDomain(updatedEntity);
  }

  async remove(id: Taxon['id']): Promise<void> {
    await this.taxonRepository.delete(id);
  }
}
