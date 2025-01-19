import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacteristicEntity } from '../entities/characteristic.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Characteristic } from '../../../../domain/characteristic';
import { CharacteristicRepository } from '../../../../domain/characteristic.repository';
import { CharacteristicMapper } from '../mappers/characteristic.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';
import { CharacteristicType } from '../../../../../characteristic-types/domain/characteristic-type';

@Injectable()
export class CharacteristicRelationalRepository
  implements CharacteristicRepository
{
  constructor(
    @InjectRepository(CharacteristicEntity)
    private readonly characteristicRepository: Repository<CharacteristicEntity>,
  ) {}

  async findAllByTypeId(typeId: CharacteristicType['id'], limit = 10) {
    const query = this.characteristicRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.type', 't')
      .select('t.name as type')
      .where('c.typeId = :typeId', { typeId })
      .limit(limit)
      .addSelect('c.id as id')
      .addSelect('c.name as name');

    const results = await query.getRawMany();

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
    }));
  }

  async findByName(
    name: Characteristic['name'],
  ): Promise<NullableType<Characteristic>> {
    const entity = await this.characteristicRepository.findOne({
      where: { name: name },
    });

    return entity ? CharacteristicMapper.toDomain(entity) : null;
  }

  async create(data: Characteristic): Promise<Characteristic> {
    const persistenceModel = CharacteristicMapper.toPersistence(data);
    const newEntity = await this.characteristicRepository.save(
      this.characteristicRepository.create(persistenceModel),
    );
    return CharacteristicMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<Characteristic>> {
    const query = this.characteristicRepository.createQueryBuilder('c');

    if (paginationOptions.filters?.name) {
      query.where('c.name LIKE :name', {
        name: `%${paginationOptions.filters.name}%`,
      });
    }

    if (paginationOptions.filters?.description) {
      query.andWhere('c.description LIKE :description', {
        description: `%${paginationOptions.filters.description}%`,
      });
    }

    const [entities, totalCount] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [
      entities.map((user) => CharacteristicMapper.toDomain(user)),
      totalCount,
    ];
  }

  async findById(
    id: Characteristic['id'],
  ): Promise<NullableType<Characteristic>> {
    const entity = await this.characteristicRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? CharacteristicMapper.toDomain(entity) : null;
  }

  async update(
    id: Characteristic['id'],
    payload: Partial<Characteristic>,
  ): Promise<Characteristic> {
    const entity = await this.characteristicRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.characteristicRepository.save(
      this.characteristicRepository.create(
        CharacteristicMapper.toPersistence({
          ...CharacteristicMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CharacteristicMapper.toDomain(updatedEntity);
  }

  async remove(id: Characteristic['id']): Promise<void> {
    await this.characteristicRepository.delete(Number(id));
  }
}
