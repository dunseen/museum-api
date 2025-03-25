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
import { CharacteristicFactory } from '../characteristics/domain/characteristic.factory';
import { GetTaxonDto } from './dto/get-taxon.dto';
import { CharacteristicRepository } from '../characteristics/domain/characteristic.repository';
import { Characteristic } from '../characteristics/domain/characteristic';

@Injectable()
export class TaxonsService {
  constructor(
    private readonly taxonRepository: TaxonRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly characteristicRepository: CharacteristicRepository,
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

    if (createTaxonDto?.parentId) {
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

    if (createTaxonDto.characteristicIds?.length) {
      newTaxon.characteristics = [];

      for (const characteristicId of createTaxonDto.characteristicIds) {
        const characteristic =
          await this.characteristicRepository.findById(characteristicId);

        if (!characteristic) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              characteristics: 'notFound',
            },
          });
        }

        newTaxon.characteristics.push(characteristic);
      }
    }

    newTaxon.name = createTaxonDto.name;
    newTaxon.hierarchy = hiearchy;

    return this.taxonRepository.create(newTaxon);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetTaxonDto[], number]> {
    const [taxons, count] = await this.taxonRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        filters: {
          name: paginationOptions.filters?.name,
        },
      },
    });

    const formmatedTaxons: GetTaxonDto[] = taxons.map((taxon) => ({
      hierarchy: {
        id: taxon.hierarchy.id,
        name: taxon.hierarchy.name,
      },
      id: taxon.id,
      name: taxon.name,
      parent: taxon?.parent
        ? { id: taxon.parent.id, name: taxon.parent.name }
        : null,
      characteristics: taxon?.characteristics?.map(CharacteristicFactory.toDto),
    }));

    return [formmatedTaxons, count];
  }

  findOne(id: Taxon['id']) {
    return this.taxonRepository.findById(id);
  }

  async update(id: Taxon['id'], updateTaxonDto: UpdateTaxonDto) {
    const characteristics: Characteristic[] = [];

    if (updateTaxonDto.characteristicIds?.length) {
      for (const characteristicId of updateTaxonDto.characteristicIds) {
        const characteristic =
          await this.characteristicRepository.findById(characteristicId);

        if (!characteristic) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              characteristics: 'notFound',
            },
          });
        }

        characteristics.push(characteristic);
      }
    }

    const updatedTaxon = {
      ...updateTaxonDto,
      characteristics,
    };

    return this.taxonRepository.update(id, updatedTaxon);
  }

  remove(id: Taxon['id']) {
    return this.taxonRepository.remove(id);
  }
}
