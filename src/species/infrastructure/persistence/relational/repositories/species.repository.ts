import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { speciesEntity } from '../entities/species.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Species } from '../../../../domain/species';
import { speciesRepository } from '../../species.repository';
import { speciesMapper } from '../mappers/species.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class speciesRelationalRepository implements speciesRepository {
  constructor(
    @InjectRepository(speciesEntity)
    private readonly speciesRepository: Repository<speciesEntity>,
  ) {}

  async create(data: Species): Promise<Species> {
    const persistenceModel = speciesMapper.toPersistence(data);
    const newEntity = await this.speciesRepository.save(
      this.speciesRepository.create(persistenceModel),
    );
    return speciesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Species[]> {
    const entities = await this.speciesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((user) => speciesMapper.toDomain(user));
  }

  async findById(id: Species['id']): Promise<NullableType<Species>> {
    const entity = await this.speciesRepository.findOne({
      where: { id },
    });

    return entity ? speciesMapper.toDomain(entity) : null;
  }

  async update(id: Species['id'], payload: Partial<Species>): Promise<Species> {
    const entity = await this.speciesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.speciesRepository.save(
      this.speciesRepository.create(
        speciesMapper.toPersistence({
          ...speciesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return speciesMapper.toDomain(updatedEntity);
  }

  async remove(id: Species['id']): Promise<void> {
    await this.speciesRepository.delete(id);
  }
}
