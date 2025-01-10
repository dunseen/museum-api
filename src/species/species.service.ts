import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { SpecieRepository } from './infrastructure/persistence/specie.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Specie } from './domain/specie';
import { CharacteristicRepository } from '../characteristics/infrastructure/persistence/characteristic.repository';
import { TaxonRepository } from '../taxons/infrastructure/persistence/taxon.repository';
import { FileRepository } from '../files/infrastructure/persistence/file.repository';
import { SpecieBuilder } from './domain/specie-builder';
import { SpecieFactory } from './domain/specie.factory';
import { GetSpecieDto } from './dto/get-all-species.dto';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly specieRepository: SpecieRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly taxonRepository: TaxonRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  private async _validateCharacteristic(
    characteristicIds: number[],
    specie: Specie,
  ) {
    const promise = characteristicIds.map(async (id) => {
      const characteristic = await this.characteristicRepository.findById(id);
      if (!characteristic) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            characteristicIds: `characteristic with id: ${id} not found`,
          },
        });
      }

      specie.addCharacteristic(characteristic);
    });

    await Promise.all(promise);
  }

  private async _validateTaxon(taxonIds: number[], specie: Specie) {
    const promise = taxonIds.map(async (id) => {
      const taxon = await this.taxonRepository.findById(id);
      if (!taxon) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            taxonIds: `taxon with id: ${id} not found`,
          },
        });
      }

      specie.addTaxon(taxon);
    });

    await Promise.all(promise);
  }

  private async _validateFile(fileIds: string[], specie: Specie) {
    const promise = fileIds.map(async (id) => {
      const file = await this.fileRepository.findById(id);
      if (!file) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            fileIds: `file with id: ${id} not found`,
          },
        });
      }

      specie.addFile(file);
    });

    await Promise.all(promise);
  }

  private async _validateIfSpecieExists(scientificName: string) {
    const bookedSpecie =
      await this.specieRepository.findByScientificName(scientificName);

    if (bookedSpecie) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: { scientificName: 'scientific name already exists' },
      });
    }
  }

  async create(createSpecieDto: CreateSpecieDto) {
    const specie = new SpecieBuilder()
      .setCommonName(createSpecieDto.commonName)
      .setScientificName(createSpecieDto.scientificName)
      .build();

    const { characteristicIds, taxonIds, fileIds } = createSpecieDto;

    await Promise.all([
      this._validateIfSpecieExists(createSpecieDto.scientificName),
      this._validateCharacteristic(characteristicIds, specie),
      this._validateTaxon(taxonIds, specie),
      this._validateFile(fileIds, specie),
    ]);

    return this.specieRepository.create(specie);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[GetSpecieDto[], number]> {
    const [species, count] = await this.specieRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });

    return [SpecieFactory.createSpecieListDto(species), count];
  }

  async findOne(id: Specie['id']) {
    const specie = await this.specieRepository.findById(id);

    if (!specie) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Specie with id ${id} not found`,
      });
    }

    return specie;
  }

  update(id: Specie['id'], updateSpecieDto: UpdateSpecieDto) {
    return this.specieRepository.update(id, updateSpecieDto);
  }

  remove(id: Specie['id']) {
    return this.specieRepository.remove(id);
  }
}
