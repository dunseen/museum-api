import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HierarchyEntity } from '../entities/hierarchy.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Hierarchy } from '../../../../domain/hierarchy';
import { HierarchyRepository } from '../../hierarchy.repository';
import { HierarchyMapper } from '../mappers/hierarchy.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class HierarchyRelationalRepository implements HierarchyRepository {
  constructor(
    @InjectRepository(HierarchyEntity)
    private readonly hierarchyRepository: Repository<HierarchyEntity>,
  ) {}

  async create(data: Hierarchy): Promise<Hierarchy> {
    const persistenceModel = HierarchyMapper.toPersistence(data);
    const newEntity = await this.hierarchyRepository.save(
      this.hierarchyRepository.create(persistenceModel),
    );
    return HierarchyMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Hierarchy>> {
    const [entities, totalCount] = await this.hierarchyRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return [entities.map((user) => HierarchyMapper.toDomain(user)), totalCount];
  }

  async findById(id: Hierarchy['id']): Promise<NullableType<Hierarchy>> {
    const entity = await this.hierarchyRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? HierarchyMapper.toDomain(entity) : null;
  }

  async update(
    id: Hierarchy['id'],
    payload: Partial<Hierarchy>,
  ): Promise<Hierarchy> {
    const entity = await this.hierarchyRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.hierarchyRepository.save(
      this.hierarchyRepository.create(
        HierarchyMapper.toPersistence({
          ...HierarchyMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return HierarchyMapper.toDomain(updatedEntity);
  }

  async remove(id: Hierarchy['id']): Promise<void> {
    await this.hierarchyRepository.delete(id);
  }
}
