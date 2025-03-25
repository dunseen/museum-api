import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { SpecieRepository } from './infrastructure/persistence/specie.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Specie } from './domain/specie';
import { CharacteristicRepository } from '../characteristics/domain/characteristic.repository';
import { TaxonRepository } from '../taxons/infrastructure/persistence/taxon.repository';
import { SpecieBuilder } from './domain/specie-builder';
import { SpecieFactory } from './domain/specie.factory';
import { GetSpecieDto } from './dto/get-all-species.dto';
import { FilesMinioService } from '../files/infrastructure/uploader/minio/files.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { CreatePostUseCase } from '../posts/application/use-cases/create-post.use-case';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly specieRepository: SpecieRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly taxonRepository: TaxonRepository,
    private readonly filesMinioService: FilesMinioService,
    private readonly createPostUseCase: CreatePostUseCase,
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

  async create(
    createSpecieDto: CreateSpecieDto,
    files: Express.MulterS3.File[],
    payload: JwtPayloadType,
  ) {
    const specie = new SpecieBuilder()
      .setCommonName(createSpecieDto.commonName)
      .setScientificName(createSpecieDto.scientificName)
      .setDescription(createSpecieDto.description)
      .build();

    const { characteristicIds, taxonIds } = createSpecieDto;

    await Promise.all([
      this._validateIfSpecieExists(createSpecieDto.scientificName),
      this._validateCharacteristic(characteristicIds, specie),
      this._validateTaxon(taxonIds, specie),
    ]);

    const createdSpecie = await this.specieRepository.create(specie);

    await this.filesMinioService.create(files, {
      specieId: createdSpecie.id,
    });

    await this.createPostUseCase.execute(
      {
        specieId: createdSpecie.id,
      },
      payload,
    );

    return SpecieFactory.toDto(createdSpecie);
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
        filters: {
          name: paginationOptions.filters?.name,
        },
      },
    });

    return [species.map(SpecieFactory.toDto), count];
  }

  findOne(id: Specie['id']) {
    return this.specieRepository.findById(id);
  }

  update(id: Specie['id'], updateSpecieDto: UpdateSpecieDto) {
    return this.specieRepository.update(id, updateSpecieDto);
  }

  remove(id: Specie['id']) {
    return this.specieRepository.remove(id);
  }
}
