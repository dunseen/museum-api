import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacteristicTypeEntity } from '../entities/characteristic-type.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CharacteristicType } from '../../../../domain/characteristic-type';
import { CharacteristicTypeRepository } from '../../characteristic-type.repository';
import { CharacteristicTypeMapper } from '../mappers/characteristic-type.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class CharacteristicTypeRelationalRepository
  implements CharacteristicTypeRepository
{
  constructor(
    @InjectRepository(CharacteristicTypeEntity)
    private readonly characteristicTypeRepository: Repository<CharacteristicTypeEntity>,
  ) {}
  async findAll(limit = 10): Promise<CharacteristicType[]> {
    const types = await this.characteristicTypeRepository.find({
      take: limit,
    });

    return types.map(CharacteristicTypeMapper.toDomain);
  }
  async findByName(
    name: CharacteristicType['name'],
  ): Promise<NullableType<CharacteristicType>> {
    const entity = await this.characteristicTypeRepository.findOne({
      where: { name },
    });

    return entity ? CharacteristicTypeMapper.toDomain(entity) : null;
  }

  async create(data: CharacteristicType): Promise<CharacteristicType> {
    const persistenceModel = CharacteristicTypeMapper.toPersistence(data);
    const newEntity = await this.characteristicTypeRepository.save(
      this.characteristicTypeRepository.create(persistenceModel),
    );
    return CharacteristicTypeMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<CharacteristicType>> {
    const query = this.characteristicTypeRepository.createQueryBuilder('c');

    if (paginationOptions.filters?.name) {
      query.where('c.name LIKE :name', {
        name: `%${paginationOptions.filters.name}%`,
      });
    }
    const [entities, totalCount] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [
      entities.map((user) => CharacteristicTypeMapper.toDomain(user)),
      totalCount,
    ];
  }

  async findById(
    id: CharacteristicType['id'],
  ): Promise<NullableType<CharacteristicType>> {
    const entity = await this.characteristicTypeRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? CharacteristicTypeMapper.toDomain(entity) : null;
  }

  async update(
    id: CharacteristicType['id'],
    payload: Partial<CharacteristicType>,
  ): Promise<CharacteristicType> {
    const entity = await this.characteristicTypeRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.characteristicTypeRepository.save(
      this.characteristicTypeRepository.create(
        CharacteristicTypeMapper.toPersistence({
          ...CharacteristicTypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CharacteristicTypeMapper.toDomain(updatedEntity);
  }

  async remove(id: CharacteristicType['id']): Promise<void> {
    await this.characteristicTypeRepository.delete(Number(id));
  }
}
