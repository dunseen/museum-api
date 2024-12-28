import { Injectable } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { SpeciesRepository } from './infrastructure/persistence/species.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Species } from './domain/species';

@Injectable()
export class SpeciesService {
  constructor(private readonly speciesRepository: SpeciesRepository) {}

  create(createspeciesDto: CreateSpeciesDto) {
    return this.speciesRepository.create(createspeciesDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.speciesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Species['id']) {
    return this.speciesRepository.findById(id);
  }

  update(id: Species['id'], updatespeciesDto: UpdateSpeciesDto) {
    return this.speciesRepository.update(id, updatespeciesDto);
  }

  remove(id: Species['id']) {
    return this.speciesRepository.remove(id);
  }
}
