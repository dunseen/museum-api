import { Injectable } from '@nestjs/common';
import { CreateHierarchyDto } from './application/dto/create-hierarchy.dto';
import { UpdateHierarchyDto } from './application/dto/update-hierarchy.dto';
import { HierarchyRepository } from './infrastructure/persistence/hierarchy.repository';
import { Hierarchy } from './domain/hierarchy';

@Injectable()
export class HierarchiesService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  create(createHierarchyDto: CreateHierarchyDto) {
    return this.hierarchyRepository.create(createHierarchyDto);
  }

  findAll() {
    return this.hierarchyRepository.findAll();
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
