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

@Injectable()
export class CharacteristicsService {
  constructor(
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
  ) {}

  async create(createCharacteristicDto: CreateCharacteristicDto) {
    const characteristic = new Characteristic();

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

    characteristic.name = createCharacteristicDto.name;
    characteristic.description = createCharacteristicDto.description;
    characteristic.type = type;

    return this.characteristicRepository.create(characteristic);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.characteristicRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Characteristic['id']) {
    return this.characteristicRepository.findById(id);
  }

  update(
    id: Characteristic['id'],
    updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.characteristicRepository.update(id, updateCharacteristicDto);
  }

  remove(id: Characteristic['id']) {
    return this.characteristicRepository.remove(id);
  }
}
