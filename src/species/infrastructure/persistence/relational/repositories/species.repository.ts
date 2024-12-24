import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { speciesEntity } from '../entities/species.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { species } from '../../../../domain/species';
import { speciesRepository } from '../../species.repository';
import { speciesMapper } from '../mappers/species.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class speciesRelationalRepository implements speciesRepository {
  constructor(
    @InjectRepository(speciesEntity)
    private readonly speciesRepository: Repository<speciesEntity>,
  ) {}

  async create(data: species): Promise<species> {
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
  }): Promise<species[]> {
    const entities = await this.speciesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((user) => speciesMapper.toDomain(user));
  }

  async findById(id: species['id']): Promise<NullableType<species>> {
    const entity = await this.speciesRepository.findOne({
      where: { id },
    });

    return entity ? speciesMapper.toDomain(entity) : null;
  }

  async update(id: species['id'], payload: Partial<species>): Promise<species> {
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

  async remove(id: species['id']): Promise<void> {
    await this.speciesRepository.delete(id);
  }
}
