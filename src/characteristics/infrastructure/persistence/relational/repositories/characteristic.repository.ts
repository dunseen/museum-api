import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacteristicEntity } from '../entities/characteristic.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Characteristic } from '../../../../domain/characteristic';
import { CharacteristicRepository } from '../../characteristic.repository';
import { CharacteristicMapper } from '../mappers/characteristic.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class CharacteristicRelationalRepository
  implements CharacteristicRepository
{
  constructor(
    @InjectRepository(CharacteristicEntity)
    private readonly characteristicRepository: Repository<CharacteristicEntity>,
  ) {}
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
    const [entities, totalCount] =
      await this.characteristicRepository.findAndCount({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      });

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
    await this.characteristicRepository.delete(id);
  }
}
