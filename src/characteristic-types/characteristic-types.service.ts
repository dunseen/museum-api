import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCharacteristicTypeDto } from './dto/create-characteristic-type.dto';
import { UpdateCharacteristicTypeDto } from './dto/update-characteristic-type.dto';
import { CharacteristicTypeRepository } from './infrastructure/persistence/characteristic-type.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CharacteristicType } from './domain/characteristic-type';
import { GetCharacteristicTypeDto } from './dto/get-characteristic-type.dto';
import { CharacteristicTypeFactory } from './domain/characteristic-type.factory';

@Injectable()
export class CharacteristicTypesService {
  constructor(
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
  ) {}

  async create(createCharacteristicTypeDto: CreateCharacteristicTypeDto) {
    const type = CharacteristicType.create(createCharacteristicTypeDto.name);

    const bookedType = await this.characteristicTypeRepository.findByName(
      createCharacteristicTypeDto.name,
    );

    if (bookedType) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: {
          name: 'type already booked.',
        },
      });
    }

    const newType = await this.characteristicTypeRepository.create(type);

    return CharacteristicTypeFactory.toDto(newType);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetCharacteristicTypeDto[], number]> {
    const [types, count] =
      await this.characteristicTypeRepository.findAllWithPagination({
        paginationOptions: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
          filters: {
            name: paginationOptions.filters?.name,
          },
        },
      });

    return [types.map(CharacteristicTypeFactory.toDto), count];
  }

  async findOne(id: CharacteristicType['id']) {
    const type = await this.characteristicTypeRepository.findById(id);

    return type ? CharacteristicTypeFactory.toDto(type) : null;
  }

  async update(
    id: CharacteristicType['id'],
    updateCharacteristicTypeDto: UpdateCharacteristicTypeDto,
  ) {
    await this.characteristicTypeRepository.update(
      id,
      updateCharacteristicTypeDto,
    );
  }

  remove(id: CharacteristicType['id']) {
    return this.characteristicTypeRepository.remove(id);
  }
}
