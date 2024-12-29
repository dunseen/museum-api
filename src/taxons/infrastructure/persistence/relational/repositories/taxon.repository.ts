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
    const [entities, totalCount] = await this.taxonRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

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
