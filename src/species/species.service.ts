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
import { generateFileName } from '../utils/string';
import { CityRepository } from '../cities/infrastructure/persistence/city.repository';
import { StateRepository } from '../states/infrastructure/persistence/state.repository';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly specieRepository: SpecieRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly taxonRepository: TaxonRepository,
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
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

  private async _validateCity(cityId: number, specie: Specie) {
    const city = await this.cityRepository.findById(cityId);

    if (!city) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { cityId: 'city not found' },
      });
    }

    specie.addCity(city);
  }

  private async _validateState(stateId: number, specie: Specie) {
    const state = await this.stateRepository.findById(stateId);

    if (!state) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { stateId: 'state not found' },
      });
    }

    specie.addState(state);
  }

  async create(
    createSpecieDto: CreateSpecieDto,
    files: Express.Multer.File[],
    payload: JwtPayloadType,
  ) {
    const specie = new SpecieBuilder()
      .setCommonName(createSpecieDto.commonName)
      .setLocation(createSpecieDto.location.address)
      .setLat(createSpecieDto.location.lat)
      .setLong(createSpecieDto.location.long)
      .setCollectedAt(createSpecieDto.collectedAt)
      .setScientificName(createSpecieDto.scientificName)
      .setDescription(createSpecieDto.description)
      .build();

    const { characteristicIds, taxonIds } = createSpecieDto;

    await Promise.all([
      this._validateIfSpecieExists(createSpecieDto.scientificName),
      this._validateCharacteristic(characteristicIds, specie),
      this._validateTaxon(taxonIds, specie),
      this._validateCity(createSpecieDto.location.cityId, specie),
      this._validateState(createSpecieDto.location.stateId, specie),
    ]);

    const createdSpecie = await this.specieRepository.create(specie);

    await this.filesMinioService.save(
      files.map((f) => ({
        fileStream: f.buffer,
        path: `/species/${createdSpecie.id}/${generateFileName(f.originalname)}`,
        specieId: createdSpecie.id,
      })),
    );

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

  async update(
    id: Specie['id'],
    updateSpecieDto: UpdateSpecieDto,
    files: Express.Multer.File[],
    payload: JwtPayloadType,
  ) {
    const specie = await this.specieRepository.findById(id);

    if (!specie) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { id: 'specie not found' },
      });
    }

    const specieBuilder = new SpecieBuilder().setId(specie.id);

    if (updateSpecieDto?.scientificName) {
      specieBuilder.setScientificName(updateSpecieDto.scientificName);
    }

    if (updateSpecieDto?.commonName) {
      specieBuilder.setCommonName(updateSpecieDto.commonName);
    }

    if (updateSpecieDto?.description) {
      specieBuilder.setDescription(updateSpecieDto.description);
    }

    if (updateSpecieDto?.collectedAt) {
      specieBuilder.setCollectedAt(updateSpecieDto.collectedAt);
    }

    if (updateSpecieDto?.location?.address) {
      specieBuilder.setLocation(updateSpecieDto.location.address);
    }

    if (updateSpecieDto?.location?.lat) {
      specieBuilder.setLat(updateSpecieDto.location.lat);
    }

    if (updateSpecieDto?.location?.long) {
      specieBuilder.setLong(updateSpecieDto.location.long);
    }

    const specieToUpdate = specieBuilder.build();

    await this._validateCharacteristic(
      updateSpecieDto.characteristicIds ?? [],
      specieToUpdate,
    );

    if (updateSpecieDto?.taxonIds) {
      await this._validateTaxon(updateSpecieDto.taxonIds, specieToUpdate);
    }

    if (updateSpecieDto?.location?.cityId) {
      await this._validateCity(updateSpecieDto.location.cityId, specieToUpdate);
    }

    if (updateSpecieDto?.location?.stateId) {
      await this._validateState(
        updateSpecieDto.location.stateId,
        specieToUpdate,
      );
    }

    if (files?.length) {
      await this.filesMinioService.save(
        files.map((f) => ({
          fileStream: f.buffer,
          path: `/species/${id}/${generateFileName(f.originalname)}`,
          specieId: id,
        })),
      );
    }

    if (updateSpecieDto?.filesToDelete?.length) {
      await this.filesMinioService.delete(updateSpecieDto.filesToDelete);
    }

    await this.specieRepository.update(id, specieToUpdate);

    await this.createPostUseCase.execute(
      {
        specieId: id,
      },
      payload,
    );
  }

  remove(id: Specie['id']) {
    return this.specieRepository.remove(id);
  }
}
