import { Injectable } from '@nestjs/common';
import { CreateTaxonDto } from './dto/create-taxon.dto';
import { UpdateTaxonDto } from './dto/update-taxon.dto';
import { TaxonRepository } from './infrastructure/persistence/taxon.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Taxon } from './domain/taxon';

@Injectable()
export class TaxonsService {
  constructor(private readonly taxonRepository: TaxonRepository) {}

  create(createTaxonDto: CreateTaxonDto) {
    return this.taxonRepository.create(createTaxonDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.taxonRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Taxon['id']) {
    return this.taxonRepository.findById(id);
  }

  update(id: Taxon['id'], updateTaxonDto: UpdateTaxonDto) {
    return this.taxonRepository.update(id, updateTaxonDto);
  }

  remove(id: Taxon['id']) {
    return this.taxonRepository.remove(id);
  }
}
