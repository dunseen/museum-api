import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTaxonDto } from './dto/create-taxon.dto';
import { UpdateTaxonDto } from './dto/update-taxon.dto';
import { TaxonRepository } from './infrastructure/persistence/taxon.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Taxon } from './domain/taxon';
import { HierarchyRepository } from '../hierarchies/infrastructure/persistence/hierarchy.repository';

@Injectable()
export class TaxonsService {
  constructor(
    private readonly taxonRepository: TaxonRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async create(createTaxonDto: CreateTaxonDto) {
    const newTaxon = new Taxon();

    const hiearchy = await this.hierarchyRepository.findById(
      createTaxonDto.hierarchyId,
    );

    if (!hiearchy) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hierchyId: 'notFound',
        },
      });
    }

    if (createTaxonDto.parentId) {
      const parent = await this.taxonRepository.findById(
        createTaxonDto.parentId,
      );

      if (!parent) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            parent: 'notFound',
          },
        });
      }

      newTaxon.parent = parent;
    }

    newTaxon.name = createTaxonDto.name;
    newTaxon.hierarchy = hiearchy;

    return this.taxonRepository.create(newTaxon);
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
