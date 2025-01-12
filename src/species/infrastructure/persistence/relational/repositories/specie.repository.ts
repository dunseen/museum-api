import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecieEntity } from '../entities/specie.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Specie } from '../../../../domain/specie';
import { SpecieRepository } from '../../specie.repository';
import { SpecieMapper } from '../mappers/specie.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class SpecieRelationalRepository implements SpecieRepository {
  constructor(
    @InjectRepository(SpecieEntity)
    private readonly specieRepository: Repository<SpecieEntity>,
  ) {}
  async findByScientificName(
    scientificName: Specie['scientificName'],
  ): Promise<NullableType<Specie>> {
    const entity = await this.specieRepository.findOne({
      where: { scientificName },
    });

    return entity ? SpecieMapper.toDomain(entity) : null;
  }

  async create(data: Specie): Promise<Specie> {
    const persistenceModel = SpecieMapper.toPersistence(data);
    const newEntity = await this.specieRepository.save(
      this.specieRepository.create(persistenceModel),
    );
    return SpecieMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Specie>> {
    const query = this.specieRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.characteristics', 'characteristics')
      .leftJoinAndSelect('s.taxons', 'taxons')
      .leftJoinAndSelect('s.files', 'files')
      .leftJoinAndSelect('taxons.hierarchy', 'hierarchy')
      .leftJoinAndSelect('characteristics.type', 'type');

    if (paginationOptions.filters?.name) {
      query.where('s.scientificName LIKE :name OR s.commonName LIKE :name', {
        name: `%${paginationOptions.filters.name}%`,
      });
    }

    const [entities, totalCount] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [entities.map((user) => SpecieMapper.toDomain(user)), totalCount];
  }

  async findById(id: Specie['id']): Promise<NullableType<Specie>> {
    const entity = await this.specieRepository.findOne({
      where: { id },
    });

    return entity ? SpecieMapper.toDomain(entity) : null;
  }

  async update(id: Specie['id'], payload: Partial<Specie>): Promise<Specie> {
    const entity = await this.specieRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.specieRepository.save(
      this.specieRepository.create(
        SpecieMapper.toPersistence({
          ...SpecieMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SpecieMapper.toDomain(updatedEntity);
  }

  async remove(id: Specie['id']): Promise<void> {
    await this.specieRepository.delete(id);
  }
}
