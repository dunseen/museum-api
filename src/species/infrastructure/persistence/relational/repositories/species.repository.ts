import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeciesEntity } from '../entities/species.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Species } from '../../../../domain/species';
import { SpeciesRepository } from '../../species.repository';
import { SpeciesMapper } from '../mappers/species.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SpeciesRelationalRepository implements SpeciesRepository {
  constructor(
    @InjectRepository(SpeciesEntity)
    private readonly speciesRepository: Repository<SpeciesEntity>,
  ) {}

  async create(data: Species): Promise<Species> {
    const persistenceModel = SpeciesMapper.toPersistence(data);
    const newEntity = await this.speciesRepository.save(
      this.speciesRepository.create(persistenceModel),
    );
    return SpeciesMapper.toDomain(newEntity);
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

    return entities.map((user) => SpeciesMapper.toDomain(user));
  }

  async findById(id: Species['id']): Promise<NullableType<Species>> {
    const entity = await this.speciesRepository.findOne({
      where: { id },
    });

    return entity ? SpeciesMapper.toDomain(entity) : null;
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
        SpeciesMapper.toPersistence({
          ...SpeciesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SpeciesMapper.toDomain(updatedEntity);
  }

  async remove(id: Species['id']): Promise<void> {
    await this.speciesRepository.delete(id);
  }
}
