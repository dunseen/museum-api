import { Injectable } from '@nestjs/common';
import { CreateHierarchyDto } from './dto/create-hierarchy.dto';
import { UpdateHierarchyDto } from './dto/update-hierarchy.dto';
import { HierarchyRepository } from './infrastructure/persistence/hierarchy.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Hierarchy } from './domain/hierarchy';

@Injectable()
export class HierarchiesService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  create(createHierarchyDto: CreateHierarchyDto) {
    return this.hierarchyRepository.create(createHierarchyDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.hierarchyRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Hierarchy['id']) {
    return this.hierarchyRepository.findById(id);
  }

  update(id: Hierarchy['id'], updateHierarchyDto: UpdateHierarchyDto) {
    return this.hierarchyRepository.update(id, updateHierarchyDto);
  }

  remove(id: Hierarchy['id']) {
    return this.hierarchyRepository.remove(id);
  }
}
