import { Injectable } from '@nestjs/common';
import { CreatespeciesDto } from './dto/create-species.dto';
import { UpdatespeciesDto } from './dto/update-species.dto';
import { speciesRepository } from './infrastructure/persistence/species.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { species } from './domain/species';

@Injectable()
export class speciesService {
  constructor(private readonly speciesRepository: speciesRepository) {}

  create(createspeciesDto: CreatespeciesDto) {
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

  findOne(id: species['id']) {
    return this.speciesRepository.findById(id);
  }

  update(id: species['id'], updatespeciesDto: UpdatespeciesDto) {
    return this.speciesRepository.update(id, updatespeciesDto);
  }

  remove(id: species['id']) {
    return this.speciesRepository.remove(id);
  }
}
