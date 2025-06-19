import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { SpecialistRepository } from './infrastructure/persistence/specialist.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Specialist } from './domain/specialist';

@Injectable()
export class SpecialistsService {
  constructor(private readonly specialistRepository: SpecialistRepository) {}

  async create(createSpecialistDto: CreateSpecialistDto) {
    const specialistExists = await this.specialistRepository.findByName(
      createSpecialistDto.name,
    );

    if (specialistExists) {
      throw new ConflictException(
        `Specialist with name '${createSpecialistDto.name}' already exists.`,
      );
    }
    return this.specialistRepository.create(createSpecialistDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.specialistRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        filters: paginationOptions.filters,
      },
    });
  }

  findOne(id: Specialist['id']) {
    return this.specialistRepository.findById(id);
  }

  update(id: Specialist['id'], updateSpecialistDto: UpdateSpecialistDto) {
    return this.specialistRepository.update(id, updateSpecialistDto);
  }

  remove(id: Specialist['id']) {
    return this.specialistRepository.remove(id);
  }
}
