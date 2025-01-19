import { Injectable } from '@nestjs/common';
import { HierarchyRepository } from '../../infrastructure/persistence/hierarchy.repository';
import { ListHierarchyDto } from '../dto/list-hiearchy.dto';

@Injectable()
export class ListHierarchyUseCase {
  constructor(private readonly hieararchyRepo: HierarchyRepository) {}

  async execute(): Promise<ListHierarchyDto[]> {
    return this.hieararchyRepo.findAll();
  }
}
