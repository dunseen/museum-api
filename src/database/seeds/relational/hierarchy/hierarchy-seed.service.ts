import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HierarchySeedService {
  constructor(
    @InjectRepository(HierarchyEntity)
    private repository: Repository<HierarchyEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const hierarchies = [
        {
          name: 'reino',
        },
        {
          name: 'divisão',
        },
        {
          name: 'classe',
        },
        {
          name: 'ordem',
        },
        {
          name: 'família',
        },
        {
          name: 'gênero',
        },
      ];

      const mappedHierarchies = hierarchies.map((h, i) =>
        this.repository.create({
          ...h,
          id: i + 1,
        }),
      );

      await this.repository.save(mappedHierarchies);
    }
  }
}
