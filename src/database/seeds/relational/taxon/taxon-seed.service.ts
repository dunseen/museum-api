import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { Repository } from 'typeorm';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';

@Injectable()
export class TaxonSeedService {
  constructor(
    @InjectRepository(TaxonEntity)
    private repository: Repository<TaxonEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const taxons = [
        {
          name: 'plantae',
        },
        {
          name: 'magnoliophyta',
        },
        {
          name: 'magnoliopsida',
        },
        {
          name: 'caryophyllales',
        },
        {
          name: 'amaranthaceae',
        },
        {
          name: 'gomphrena',
        },
      ];

      const mappedTaxons = taxons.map((taxon, index) => {
        const tax = new TaxonEntity();

        let parent: TaxonEntity | null = null;

        const hierarchy = new HierarchyEntity();
        hierarchy.id = index + 1;

        if (index !== 0) {
          parent = new TaxonEntity();
          parent.id = index;
        }
        tax.id = index + 1;
        tax.name = taxon.name;
        tax.hierarchy = hierarchy;
        tax.parent = parent;

        return tax;
      });

      await this.repository.save(mappedTaxons);
    }
  }
}
