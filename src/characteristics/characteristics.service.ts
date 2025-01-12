import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import { CharacteristicRepository } from './infrastructure/persistence/characteristic.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Characteristic } from './domain/characteristic';
import { CharacteristicTypeRepository } from '../characteristic-types/infrastructure/persistence/characteristic-type.repository';
import { CharacteristicFactory } from './domain/characteristic.factory';
import { GetCharacteristicDto } from './dto/get-characteristic.dto';

@Injectable()
export class CharacteristicsService {
  constructor(
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
  ) {}

  async create(createCharacteristicDto: CreateCharacteristicDto) {
    const type = await this.characteristicTypeRepository.findById(
      createCharacteristicDto.typeId,
    );

    if (!type) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          type: 'characteristic type not found',
        },
      });
    }

    const bookedCharacteristic = await this.characteristicRepository.findByName(
      createCharacteristicDto.name,
    );

    if (bookedCharacteristic) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: {
          type: 'characteristic already booked',
        },
      });
    }

    const characteristic = Characteristic.create(
      createCharacteristicDto.name,
      createCharacteristicDto.description,
      type,
    );

    return this.characteristicRepository.create(characteristic);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetCharacteristicDto[], number]> {
    const [characteristics, count] =
      await this.characteristicRepository.findAllWithPagination({
        paginationOptions: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
          filters: {
            name: paginationOptions.filters?.name,
            description: paginationOptions.filters?.description,
          },
        },
      });

    return [characteristics.map(CharacteristicFactory.toDto), count];
  }

  async findOne(id: Characteristic['id']) {
    const characteristic = await this.characteristicRepository.findById(id);

    return characteristic ? CharacteristicFactory.toDto(characteristic) : null;
  }

  async update(
    id: Characteristic['id'],
    updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    await this.characteristicRepository.update(id, updateCharacteristicDto);
  }

  remove(id: Characteristic['id']) {
    return this.characteristicRepository.remove(id);
  }
}
