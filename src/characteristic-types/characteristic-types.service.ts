import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCharacteristicTypeDto } from './dto/create-characteristic-type.dto';
import { UpdateCharacteristicTypeDto } from './dto/update-characteristic-type.dto';
import { CharacteristicTypeRepository } from './infrastructure/persistence/characteristic-type.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CharacteristicType } from './domain/characteristic-type';

@Injectable()
export class CharacteristicTypesService {
  constructor(
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
  ) {}

  async create(createCharacteristicTypeDto: CreateCharacteristicTypeDto) {
    const type = new CharacteristicType();
    type.name = createCharacteristicTypeDto.name;

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

    return this.characteristicTypeRepository.create(type);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.characteristicTypeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: CharacteristicType['id']) {
    return this.characteristicTypeRepository.findById(id);
  }

  update(
    id: CharacteristicType['id'],
    updateCharacteristicTypeDto: UpdateCharacteristicTypeDto,
  ) {
    return this.characteristicTypeRepository.update(
      id,
      updateCharacteristicTypeDto,
    );
  }

  remove(id: CharacteristicType['id']) {
    return this.characteristicTypeRepository.remove(id);
  }
}
