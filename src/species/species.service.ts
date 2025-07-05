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
import { SpecialistRepository } from '../specialists/infrastructure/persistence/specialist.repository';
import { ChangeLogsService } from '../change-logs/change-logs.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly specieRepository: SpecieRepository,

    private readonly specialistRepository: SpecialistRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly taxonRepository: TaxonRepository,
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
    private readonly filesMinioService: FilesMinioService,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly usersService: UsersService,
    private readonly changeLogsService: ChangeLogsService,
  ) {}

  private async _validateCharacteristic(
    characteristicIds: number[],
    specieBuilder: SpecieBuilder,
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

      specieBuilder.addCharacteristic(characteristic);
    });

    await Promise.all(promise);
  }

  private async _validateTaxon(
    taxonIds: number[],
    specieBuilder: SpecieBuilder,
  ) {
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

      specieBuilder.addTaxon(taxon);
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

  private async _validateCity(cityId: number, specieBuilder: SpecieBuilder) {
    const city = await this.cityRepository.findById(cityId);

    if (!city) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { cityId: 'city not found' },
      });
    }

    specieBuilder.setCity(city);
  }

  private async _validateState(stateId: number, specieBuilder: SpecieBuilder) {
    const state = await this.stateRepository.findById(stateId);

    if (!state) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { stateId: 'state not found' },
      });
    }

    specieBuilder.setState(state);
  }

  private async _validateDeterminator(
    determinatorId: string,
    specieBuilder: SpecieBuilder,
  ) {
    const determinator =
      await this.specialistRepository.findById(determinatorId);

    if (!determinator) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { determinatorId: 'determinator not found' },
      });
    }

    specieBuilder.setDeterminator(determinator);
  }

  private async _validateCollector(
    collectorId: string,
    specieBuilder: SpecieBuilder,
  ) {
    const collector = await this.specialistRepository.findById(collectorId);

    if (!collector) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { collectorId: 'collector not found' },
      });
    }

    specieBuilder.setCollector(collector);
  }

  async create(
    createSpecieDto: CreateSpecieDto,
    files: Express.Multer.File[],
    payload: JwtPayloadType,
  ) {
    const specieBuilder = new SpecieBuilder()
      .setCommonName(createSpecieDto.commonName)
      .setCollectLocation(createSpecieDto.location.address)
      .setLat(createSpecieDto.location.lat)
      .setLong(createSpecieDto.location.long)
      .setCollectedAt(createSpecieDto.collectedAt)
      .setDeterminatedAt(createSpecieDto.determinatedAt)
      .setScientificName(createSpecieDto.scientificName)
      .setDescription(createSpecieDto.description);

    const { characteristicIds, taxonIds } = createSpecieDto;

    await Promise.all([
      this._validateIfSpecieExists(createSpecieDto.scientificName),
      this._validateCharacteristic(characteristicIds, specieBuilder),
      this._validateTaxon(taxonIds, specieBuilder),
      this._validateCity(createSpecieDto.location.cityId, specieBuilder),
      this._validateState(createSpecieDto.location.stateId, specieBuilder),
      this._validateCollector(createSpecieDto.collectorId, specieBuilder),
      this._validateDeterminator(createSpecieDto.determinatorId, specieBuilder),
    ]);

    const specie = specieBuilder.build();

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

    const changer = await this.usersService.ensureUserExists(payload.id);
    await this.changeLogsService.create({
      tableName: 'specie',
      action: 'create',
      oldValue: null,
      newValue: createdSpecie,
      changedBy: changer,
    });

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

    if (updateSpecieDto?.determinatedAt) {
      specieBuilder.setDeterminatedAt(updateSpecieDto.determinatedAt);
    }

    if (updateSpecieDto?.location?.address) {
      specieBuilder.setCollectLocation(updateSpecieDto.location.address);
    }

    if (updateSpecieDto?.location?.lat) {
      specieBuilder.setLat(updateSpecieDto.location.lat);
    }

    if (updateSpecieDto?.location?.long) {
      specieBuilder.setLong(updateSpecieDto.location.long);
    }

    await this._validateCharacteristic(
      updateSpecieDto.characteristicIds ?? [],
      specieBuilder,
    );

    if (updateSpecieDto?.taxonIds) {
      await this._validateTaxon(updateSpecieDto.taxonIds, specieBuilder);
    }

    if (updateSpecieDto?.location?.cityId) {
      await this._validateCity(updateSpecieDto.location.cityId, specieBuilder);
    }

    if (updateSpecieDto?.location?.stateId) {
      await this._validateState(
        updateSpecieDto.location.stateId,
        specieBuilder,
      );
    }

    if (updateSpecieDto?.collectorId) {
      await this._validateCollector(updateSpecieDto.collectorId, specieBuilder);
    }

    if (updateSpecieDto?.determinatorId) {
      await this._validateDeterminator(
        updateSpecieDto.determinatorId,
        specieBuilder,
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

    const specieToUpdate = specieBuilder.build();

    await this.specieRepository.update(id, specieToUpdate);

    const changer = await this.usersService.ensureUserExists(payload.id);
    await this.changeLogsService.create({
      tableName: 'specie',
      action: 'update',
      oldValue: specie,
      newValue: specieToUpdate,
      changedBy: changer,
    });

    await this.createPostUseCase.execute(
      {
        specieId: id,
      },
      payload,
    );
  }

  async remove(id: Specie['id'], payload: JwtPayloadType) {
    const specie = await this.specieRepository.findById(id);
    await this.specieRepository.remove(id);

    if (specie) {
      const changer = await this.usersService.ensureUserExists(payload.id);
      await this.changeLogsService.create({
        tableName: 'specie',
        action: 'delete',
        oldValue: specie,
        newValue: null,
        changedBy: changer,
      });
    }
  }
}
