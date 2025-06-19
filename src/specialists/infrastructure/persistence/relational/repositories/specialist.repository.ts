import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SpecialistEntity } from '../entities/specialist.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Specialist } from '../../../../domain/specialist';
import { SpecialistRepository } from '../../specialist.repository';
import { SpecialistMapper } from '../mappers/specialist.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class SpecialistRelationalRepository implements SpecialistRepository {
  constructor(
    @InjectRepository(SpecialistEntity)
    private readonly specialistRepository: Repository<SpecialistEntity>,
  ) {}

  async create(data: Specialist): Promise<Specialist> {
    const persistenceModel = SpecialistMapper.toPersistence(data);

    const newEntity = await this.specialistRepository.save(
      this.specialistRepository.create(persistenceModel),
    );
    return SpecialistMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Specialist>> {
    const where: any = {};

    if (paginationOptions.filters?.name) {
      where.name = Like(`%${paginationOptions.filters.name}%`);
    }

    if (paginationOptions.filters?.specialistType) {
      where.type = paginationOptions.filters.specialistType;
    }

    const [entities, totalCount] = await this.specialistRepository.findAndCount(
      {
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
        where,
      },
    );

    return [
      entities.map((user) => SpecialistMapper.toDomain(user)),
      totalCount,
    ];
  }

  async findById(id: Specialist['id']): Promise<NullableType<Specialist>> {
    const entity = await this.specialistRepository.findOne({
      where: { id },
    });

    return entity ? SpecialistMapper.toDomain(entity) : null;
  }

  async findByName(
    name: Specialist['name'],
  ): Promise<NullableType<Specialist>> {
    const entity = await this.specialistRepository.findOne({
      where: { name },
    });

    return entity ? SpecialistMapper.toDomain(entity) : null;
  }

  async update(
    id: Specialist['id'],
    payload: Partial<Specialist>,
  ): Promise<Specialist> {
    const entity = await this.specialistRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.specialistRepository.save(
      this.specialistRepository.create(
        SpecialistMapper.toPersistence({
          ...SpecialistMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SpecialistMapper.toDomain(updatedEntity);
  }

  async remove(id: Specialist['id']): Promise<void> {
    await this.specialistRepository.delete(id);
  }
}
