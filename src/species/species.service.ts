import { Injectable } from '@nestjs/common';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { SpecieRepository } from './infrastructure/persistence/specie.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Specie } from './domain/specie';

@Injectable()
export class SpeciesService {
  constructor(private readonly specieRepository: SpecieRepository) {}

  create(createSpecieDto: CreateSpecieDto) {
    return this.specieRepository.create(createSpecieDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.specieRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Specie['id']) {
    return this.specieRepository.findById(id);
  }

  update(id: Specie['id'], updateSpecieDto: UpdateSpecieDto) {
    return this.specieRepository.update(id, updateSpecieDto);
  }

  remove(id: Specie['id']) {
    return this.specieRepository.remove(id);
  }
}
