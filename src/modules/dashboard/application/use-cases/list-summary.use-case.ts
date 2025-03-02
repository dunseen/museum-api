import { Injectable } from '@nestjs/common';
import { SpecieRepository } from '../../../../species/infrastructure/persistence/specie.repository';
import { CharacteristicRepository } from '../../../../characteristics/domain/characteristic.repository';
import { TaxonRepository } from '../../../../taxons/infrastructure/persistence/taxon.repository';
import { ListSummaryCountsDto } from '../dtos/list-summary-counts.dto';

@Injectable()
export class ListDashboardSummaryUseCase {
  constructor(
    private readonly specieRepo: SpecieRepository,
    private readonly characteristicRepo: CharacteristicRepository,
    private readonly taxonRepo: TaxonRepository,
  ) {}

  async execute(): Promise<ListSummaryCountsDto> {
    const [specieCount, characteristicCount, familyCount, orderCount] =
      await Promise.all([
        this.specieRepo.count(),
        this.characteristicRepo.count(),
        this.taxonRepo.countByType('family'),
        this.taxonRepo.countByType('order'),
      ]);

    return {
      characteristicCount,
      familyCount,
      orderCount,
      specieCount,
    };
  }
}
