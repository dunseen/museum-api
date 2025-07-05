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
import { ChangeLogsService } from '../change-logs/change-logs.service';
import { UsersService } from '../users/users.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@Injectable()
export class TaxonsService {
  constructor(
    private readonly taxonRepository: TaxonRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly usersService: UsersService,
    private readonly changeLogsService: ChangeLogsService,
  ) {}

  async create(createTaxonDto: CreateTaxonDto, payload: JwtPayloadType) {
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

    const createdTaxon = await this.taxonRepository.create(newTaxon);

    const changer = await this.usersService.ensureUserExists(payload.id);
    await this.changeLogsService.create({
      tableName: 'taxon',
      action: 'create',
      oldValue: null,
      newValue: createdTaxon,
      changedBy: changer,
    });

    return createdTaxon;
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
          hierarchyId: paginationOptions.filters?.hierarchyId,
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

  async update(
    id: Taxon['id'],
    updateTaxonDto: UpdateTaxonDto,
    payload: JwtPayloadType,
  ) {
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

    const oldTaxon = await this.taxonRepository.findById(id);

    const updatedTaxon = {
      ...updateTaxonDto,
      characteristics,
    };

    const result = await this.taxonRepository.update(id, updatedTaxon);

    const changer = await this.usersService.ensureUserExists(payload.id);
    await this.changeLogsService.create({
      tableName: 'taxon',
      action: 'update',
      oldValue: oldTaxon,
      newValue: result,
      changedBy: changer,
    });

    return result;
  }

  async remove(id: Taxon['id'], payload: JwtPayloadType) {
    const taxon = await this.taxonRepository.findById(id);
    await this.taxonRepository.remove(id);
    if (taxon) {
      const changer = await this.usersService.ensureUserExists(payload.id);
      await this.changeLogsService.create({
        tableName: 'taxon',
        action: 'delete',
        oldValue: taxon,
        newValue: null,
        changedBy: changer,
      });
    }
  }
}
