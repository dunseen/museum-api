import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ChangeRequestAction,
  ChangeRequestStatus,
  EntityType,
} from './domain/change-request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecieDraftEntity } from './infrastructure/persistence/relational/entities/specie-draft.entity';
import { ChangeRequestEntity } from './infrastructure/persistence/relational/entities/change-request.entity';
import { CharacteristicDraftEntity } from './infrastructure/persistence/relational/entities/characteristic-draft.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { CreateSpecieDto } from '../species/dto/create-specie.dto';
import { UpdateSpecieDto } from '../species/dto/update-specie.dto';
import { ProposeCharacteristicUpdateDto } from './dto/propose-characteristic-update.dto';
import {
  CharacteristicOperationResultDto,
  OperationStatus,
} from './dto/characteristic-operation-result.dto';
import { SpecieEntity } from '../species/infrastructure/persistence/relational/entities/specie.entity';
import { TaxonEntity } from '../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { CharacteristicEntity } from '../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CharacteristicTypeEntity } from '../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { StateEntity } from '../states/infrastructure/persistence/relational/entities/state.entity';
import { SpecialistEntity } from '../specialists/infrastructure/persistence/relational/entities/specialist.entity';
import {
  IPaginationOptions,
  WithCountList,
} from '../utils/types/pagination-options';
import {
  FileDiffResult,
  FilesMinioService,
} from '../files/infrastructure/uploader/minio/files.service';
import { ListChangeRequestDto } from './dto/draft-with-change-request.dto';
import { GetCharacteristicDraftDto } from './dto/get-characteristic-draft.dto';
import { FileRepository } from '../files/infrastructure/persistence/file.repository';
import { PostService } from '../posts/domain/post.service';
import { SpecieMapper } from '../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { TaxonRepository } from '../taxons/infrastructure/persistence/taxon.repository';
import { CharacteristicRepository } from '../characteristics/domain/characteristic.repository';
import { CharacteristicTypeRepository } from '../characteristic-types/infrastructure/persistence/characteristic-type.repository';
import { CityRepository } from '../cities/infrastructure/persistence/city.repository';
import { StateRepository } from '../states/infrastructure/persistence/state.repository';
import { SpecialistRepository } from '../specialists/infrastructure/persistence/specialist.repository';
import { UserMapper } from '../users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserFactory } from '../users/domain/user.factory';
import { GetSpecieDto } from '../species/dto/get-all-species.dto';
import { CharacteristicFactory } from '../characteristics/domain/characteristic.factory';
import { CharacteristicMapper } from '../characteristics/infrastructure/persistence/relational/mappers/characteristic.mapper';
import { CityMapper } from '../cities/infrastructure/persistence/relational/mappers/city.mapper';
import { StateMapper } from '../states/infrastructure/persistence/relational/mappers/state.mapper';
import { generateFileName } from '../utils/string';
import { ChangeRequestMapper } from './infrastructure/persistence/relational/mappers/change-request.mapper';
import { SpecialistMapper } from 'src/specialists/infrastructure/persistence/relational/mappers/specialist.mapper';
import { TaxonMapper } from 'src/taxons/infrastructure/persistence/relational/mappers/taxon.mapper';
import { formatLatLong } from 'src/utils/number';
import { createDiff } from 'src/utils/diff';
import { FileType } from 'src/files/domain/file';

@Injectable()
export class ChangeRequestsService {
  constructor(
    @InjectRepository(SpecieDraftEntity)
    private readonly specieDraftRepo: Repository<SpecieDraftEntity>,
    @InjectRepository(CharacteristicDraftEntity)
    private readonly characteristicDraftRepo: Repository<CharacteristicDraftEntity>,
    @InjectRepository(ChangeRequestEntity)
    private readonly crRepo: Repository<ChangeRequestEntity>,
    private readonly taxonRepository: TaxonRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly characteristicTypeRepository: CharacteristicTypeRepository,
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
    private readonly specialistRepository: SpecialistRepository,
    private readonly fileRepository: FileRepository,
    @InjectRepository(SpecieEntity)
    private readonly specieRepository: Repository<SpecieEntity>,
    @InjectRepository(CharacteristicEntity)
    private readonly characteristicEntityRepo: Repository<CharacteristicEntity>,
    private readonly filesMinioService: FilesMinioService,
    private readonly postService: PostService,
  ) {}

  private async _validateCharacteristic(
    characteristicIds: number[],
    specieEntity: SpecieDraftEntity,
  ) {
    const characteristicsIdSet = new Set<number>();

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

      if (characteristicsIdSet.has(id)) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            characteristicIds: `characteristic with id: ${id} is duplicated`,
          },
        });
      }

      characteristicsIdSet.add(id);
    });

    await Promise.all(promise);

    specieEntity.characteristics = characteristicsIdSet.size
      ? Array.from(characteristicsIdSet).map((id) => {
          const c = new CharacteristicEntity();
          c.id = Number(id);
          return c;
        })
      : [];

    characteristicsIdSet.clear();
  }

  private async _validateTaxon(
    taxonIds: number[],
    specieEntity: SpecieDraftEntity,
  ) {
    const taxonIdSet = new Set<number>();

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

      if (taxonIdSet.has(id)) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { taxonIds: `taxon with id: ${id} is duplicated` },
        });
      }

      taxonIdSet.add(id);
    });

    await Promise.all(promise);

    specieEntity.taxons = taxonIdSet.size
      ? Array.from(taxonIdSet).map((id) => {
          const t = new TaxonEntity();
          t.id = id;
          return t;
        })
      : [];

    taxonIdSet.clear();
  }

  private async _validateIfSpecieExists(scientificName: string) {
    const bookedSpecie = await this.specieRepository.findOne({
      where: { scientificName },
    });

    if (bookedSpecie) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: { scientificName: 'scientific name already exists' },
      });
    }
  }

  private async _validateCity(cityId: number, specieEntity: SpecieDraftEntity) {
    const city = await this.cityRepository.findById(cityId);

    if (!city) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { cityId: 'city not found' },
      });
    }

    specieEntity.city = CityMapper.toPersistence(city);
  }

  private async _validateState(
    stateId: number,
    specieEntity: SpecieDraftEntity,
  ) {
    const state = await this.stateRepository.findById(stateId);

    if (!state) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { stateId: 'state not found' },
      });
    }

    const stateEntity = new StateEntity();
    stateEntity.id = stateId;
    specieEntity.state = stateEntity;
  }

  private async _validateDeterminator(
    determinatorId: string,
    specieEntity: SpecieDraftEntity,
  ) {
    const determinator =
      await this.specialistRepository.findById(determinatorId);

    if (!determinator) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { determinatorId: 'determinator not found' },
      });
    }

    const determinatorEntity = new SpecialistEntity();
    determinatorEntity.id = determinatorId;
    specieEntity.determinator = determinatorEntity;
  }

  private async _validateCollector(
    collectorId: string,
    specieEntity: SpecieDraftEntity,
  ) {
    const collector = await this.specialistRepository.findById(collectorId);

    if (!collector) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { collectorId: 'collector not found' },
      });
    }

    const collectorEntity = new SpecialistEntity();
    collectorEntity.id = collectorId;
    specieEntity.collector = collectorEntity;
  }

  /**
   * Check if a characteristic is currently used by any species.
   * Used to determine if changes require approval workflow.
   */
  private async _isCharacteristicUsedBySpecies(
    characteristicId: number,
  ): Promise<boolean> {
    const count = await this.specieRepository
      .createQueryBuilder('specie')
      .innerJoin(
        'specie.characteristics',
        'char',
        'char.id = :characteristicId',
        { characteristicId },
      )
      .getCount();

    return count > 0;
  }

  async proposeSpecieDelete(
    specieId: number,
    proposedById: string,
  ): Promise<void> {
    const specie = await this.specieRepository.findOne({
      where: { id: specieId },
      relations: [
        'taxons',
        'characteristics',
        'state',
        'city',
        'collector',
        'determinator',
      ],
    });

    if (!specie) throw new NotFoundException('Specie not found');

    const cr = await this.crRepo.findOne({
      where: {
        entityId: specieId,
        entityType: EntityType.SPECIE,
        action: ChangeRequestAction.DELETE,
        status: ChangeRequestStatus.PENDING,
      },
    });

    if (cr) {
      throw new ConflictException('There is already a pending delete request');
    }

    const draft = new SpecieDraftEntity();
    draft.scientificName = specie.scientificName;
    draft.commonName = specie.commonName;
    draft.description = specie.description;
    draft.collectLocation = specie.collectLocation;
    draft.geoLocation = specie.geoLocation;
    draft.state = specie.state;
    draft.city = specie.city;
    draft.collector = specie.collector;
    draft.determinator = specie.determinator;
    draft.collectedAt = specie.collectedAt;
    draft.determinatedAt = specie.determinatedAt;
    draft.taxons = specie.taxons ?? [];
    draft.characteristics = specie.characteristics ?? [];

    const savedDraft = await this.specieDraftRepo.save(draft);

    const proposedBy = new UserEntity();
    proposedBy.id = proposedById;

    await this.crRepo.save(
      this.crRepo.create({
        entityType: EntityType.SPECIE,
        action: ChangeRequestAction.DELETE,
        status: ChangeRequestStatus.PENDING,
        entityId: specieId,
        proposedBy,
        draftId: savedDraft.id,
      }),
    );
  }

  async proposeSpecieCreate(
    dto: CreateSpecieDto,
    files: Express.Multer.File[],
    proposedById: string,
  ): Promise<void> {
    const proposedBy = new UserEntity();
    proposedBy.id = proposedById;

    const draft = new SpecieDraftEntity();

    await Promise.all([
      this._validateState(dto.location.stateId, draft),
      this._validateCity(dto.location.cityId, draft),
      this._validateCollector(dto.collectorId, draft),
      this._validateDeterminator(dto.determinatorId, draft),
      this._validateIfSpecieExists(dto.scientificName),
      this._validateTaxon(dto.taxonIds ?? [], draft),
      this._validateCharacteristic(dto.characteristicIds ?? [], draft),
    ]);

    draft.scientificName = dto.scientificName;
    draft.commonName = dto.commonName ?? null;
    draft.description = dto.description ?? null;
    draft.collectLocation = dto.location.address ?? null;
    draft.geoLocation = {
      type: 'Point',
      coordinates: [
        formatLatLong(dto.location.long),
        formatLatLong(dto.location.lat),
      ],
    };
    draft.collectedAt = dto.collectedAt;
    draft.determinatedAt = dto.determinatedAt;

    // Step 1: Save the draft first to get its ID
    const savedDraft = await this.specieDraftRepo.save(draft);

    // Step 2: Create CR with reference to the draft
    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: EntityType.SPECIE,
        action: ChangeRequestAction.CREATE,
        status: ChangeRequestStatus.PENDING,
        proposedBy,
        draftId: savedDraft.id, // Polymorphic reference
        entityId: null, // Not used for CREATE - will be set on approval
      }),
    );

    // Persist uploaded files as pending and linked to this change request
    if (files?.length) {
      await this.filesMinioService.save(
        files.map((f) => ({
          fileStream: f.buffer,
          path: `/change-requests/${cr.id}/${generateFileName(f.originalname)}`,
          changeRequestId: cr.id,
          approved: false,
        })),
      );
    }
  }

  async proposeSpecieUpdate(
    specieId: number,
    dto: UpdateSpecieDto,
    files: Express.Multer.File[],
    proposedById: string,
  ): Promise<void> {
    const proposedBy = new UserEntity();
    proposedBy.id = proposedById;

    const specie = await this.specieRepository.findOne({
      where: { id: specieId },
      relations: ['files'],
    });

    if (!specie) throw new NotFoundException('specie not found');

    // Seed draft from current specie, then override with dto
    const draft = new SpecieDraftEntity();
    draft.city = specie.city;
    draft.state = specie.state;
    draft.collector = specie.collector;
    draft.determinator = specie.determinator;
    draft.taxons = specie.taxons;
    draft.characteristics = specie.characteristics;

    if (dto?.taxonIds?.length) {
      const results = await Promise.all(
        dto.taxonIds.map((id) => this.taxonRepository.findById(id)),
      );
      const missingIndex = results.findIndex((r) => !r);
      if (missingIndex !== -1) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            taxonIds: `taxon with id: ${dto.taxonIds[missingIndex]} not found`,
          },
        });
      }

      draft.taxons = results.map(TaxonMapper.toPersistence);
    }

    if (dto?.characteristicIds?.length) {
      const ids = dto.characteristicIds.map((id) => Number(id));
      const results = await Promise.all(
        ids.map((id) => this.characteristicRepository.findById(id)),
      );
      const missingIndex = results.findIndex((r) => !r);
      if (missingIndex !== -1) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            characteristicIds: `characteristic with id: ${ids[missingIndex]} not found`,
          },
        });
      }

      draft.characteristics = results.map(CharacteristicMapper.toPersistence);
    }

    if (dto?.location?.cityId) {
      const city = await this.cityRepository.findById(dto.location.cityId);
      if (!city) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { cityId: 'city not found' },
        });
      }

      draft.city = CityMapper.toPersistence(city);
    }

    if (dto?.location?.stateId) {
      const state = await this.stateRepository.findById(dto.location.stateId);
      if (!state) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { stateId: 'state not found' },
        });
      }

      draft.state = StateMapper.toPersistence(state);
    }

    if (dto?.collectorId) {
      const collector = await this.specialistRepository.findById(
        dto.collectorId,
      );
      if (!collector) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { collectorId: 'collector not found' },
        });
      }

      draft.collector = SpecialistMapper.toPersistence(collector);
    }

    if (dto?.determinatorId) {
      const determinator = await this.specialistRepository.findById(
        dto.determinatorId,
      );
      if (!determinator) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { determinatorId: 'determinator not found' },
        });
      }

      draft.determinator = SpecialistMapper.toPersistence(determinator);
    }

    draft.scientificName = dto.scientificName ?? specie.scientificName;
    draft.commonName = dto.commonName ?? specie.commonName ?? null;
    draft.description = dto.description ?? specie.description ?? null;
    draft.collectLocation =
      dto.location?.address ?? specie.collectLocation ?? null;
    const lat = dto.location?.lat ?? specie.geoLocation.coordinates[1];
    const long = dto.location?.long ?? specie.geoLocation.coordinates[0];

    draft.geoLocation = {
      type: 'Point',
      coordinates: [formatLatLong(long), formatLatLong(lat)],
    };
    draft.collectedAt = dto.collectedAt ?? specie.collectedAt;
    draft.determinatedAt = dto.determinatedAt ?? specie.determinatedAt;

    const diff = createDiff(specie, draft);

    if (
      !Object.keys(diff).length &&
      !dto.filesToDelete?.length &&
      !files?.length
    ) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { update: 'no changes detected' },
      });
    }

    const savedDraft = await this.specieDraftRepo.save(
      this.specieDraftRepo.create(draft),
    );

    // Step 2: Create CR with reference to draft
    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: EntityType.SPECIE,
        action: ChangeRequestAction.UPDATE,
        status: ChangeRequestStatus.PENDING,
        entityId: specieId, // Points to the specie being updated
        proposedBy,
        draftId: savedDraft.id, // Polymorphic reference
        diff,
      }),
    );

    // Handle file diff
    await this._handleFileDiffForChangeRequest(
      cr.id,
      specie.files,
      files,
      dto.filesToDelete,
      diff,
    );
  }

  /**
   * Private method to handle file diff for change requests.
   * Can be reused across different entity types (specie, characteristic, taxon, etc.)
   */
  private async _handleFileDiffForChangeRequest(
    changeRequestId: number,
    existingFiles: FileType[],
    newFiles: Express.Multer.File[] | undefined,
    filesToDeleteIds: string[] | undefined,
    existingDiff: Record<string, any>,
  ): Promise<void> {
    let savedFiles: FileType[] = [];

    if (newFiles?.length) {
      const uploadedFiles = await this.filesMinioService.save(
        newFiles.map((f) => ({
          fileStream: f.buffer,
          path: `/change-requests/${changeRequestId}/${generateFileName(f.originalname)}`,
          changeRequestId,
          approved: false,
        })),
      );

      savedFiles = uploadedFiles.map((f) => f.file);
    }

    const filesDiff = this.filesMinioService.computeFileDiff(
      existingFiles,
      savedFiles,
      filesToDeleteIds,
    );

    const hasFileChanges = filesDiff.added.length || filesDiff.removed.length;

    if (hasFileChanges) {
      await this.crRepo.update(
        { id: changeRequestId },
        {
          diff: {
            ...existingDiff,
            files: filesDiff,
          },
        },
      );
    }
  }

  // ==================== Characteristic Change Requests ====================

  /**
   * Update a characteristic with conditional draft flow.
   * - If characteristic is used by any specie: create draft and require approval
   * - If characteristic is not used: update directly without approval
   */
  async updateCharacteristic(
    characteristicId: number,
    dto: ProposeCharacteristicUpdateDto,
    files: Express.Multer.File[],
    proposedById: string,
  ): Promise<CharacteristicOperationResultDto> {
    // Check if characteristic exists
    const characteristic =
      await this.characteristicRepository.findById(characteristicId);
    if (!characteristic) {
      throw new NotFoundException('characteristic not found');
    }

    // Validate type if provided
    if (dto.typeId) {
      const type = await this.characteristicTypeRepository.findById(dto.typeId);
      if (!type) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            typeId: 'characteristic type not found',
          },
        });
      }
    }

    const isUsedBySpecies =
      await this._isCharacteristicUsedBySpecies(characteristicId);

    if (!isUsedBySpecies) {
      // DIRECT FLOW: Characteristic is not used, update directly
      const charEntity = await this.characteristicEntityRepo.findOne({
        where: { id: characteristicId },
      });

      if (!charEntity) {
        throw new NotFoundException('characteristic not found');
      }

      // Update fields
      if (dto.name !== undefined) {
        charEntity.name = dto.name;
      }
      if (dto.typeId !== undefined) {
        const typeEntity = new CharacteristicTypeEntity();
        typeEntity.id = dto.typeId;
        charEntity.type = typeEntity;
      }

      await this.characteristicEntityRepo.save(charEntity);

      // Handle new files
      if (files?.length) {
        await Promise.all(
          files.map(async (f) => {
            const path = `/characteristics/${characteristicId}/${generateFileName(f.originalname)}`;
            await this.filesMinioService.save([
              {
                fileStream: f.buffer,
                path,
                characteristicId: characteristicId,
                approved: true, // Direct update, no approval needed
              },
            ]);
          }),
        );
      }

      // Handle file deletion if requested
      if (dto.filesToDelete && dto.filesToDelete.length > 0) {
        await this.filesMinioService.softDelete(dto.filesToDelete);
      }

      return {
        status: OperationStatus.COMPLETED,
        message: 'Characteristic updated successfully',
        changeRequestId: null,
      };
    }

    // DRAFT FLOW: Characteristic is used by species, require approval
    // Check for existing pending update
    const existingPendingUpdate = await this.crRepo.findOne({
      where: {
        entityId: characteristicId,
        entityType: EntityType.CHARACTERISTIC,
        action: ChangeRequestAction.UPDATE,
        status: ChangeRequestStatus.PENDING,
      },
    });

    if (existingPendingUpdate) {
      throw new ConflictException(
        'There is already a pending update request for this characteristic',
      );
    }

    // Create draft with current data + changes
    const draft = new CharacteristicDraftEntity();
    draft.name = dto.name ?? characteristic.name;
    const typeEntity = new CharacteristicTypeEntity();
    typeEntity.id = (dto.typeId ?? characteristic.type.id)!;
    draft.type = typeEntity;

    const diff = createDiff(characteristic, draft);

    if (
      !Object.keys(diff).length &&
      !dto.filesToDelete?.length &&
      !files?.length
    ) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { update: 'no changes detected' },
      });
    }

    const savedDraft = await this.characteristicDraftRepo.save(draft);

    const proposedBy = new UserEntity();
    proposedBy.id = proposedById;

    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: EntityType.CHARACTERISTIC,
        action: ChangeRequestAction.UPDATE,
        status: ChangeRequestStatus.PENDING,
        entityId: characteristicId,
        proposedBy,
        draftId: savedDraft.id,
      }),
    );

    const currentFiles = [...characteristic.files];

    await this._handleFileDiffForChangeRequest(
      cr.id,
      currentFiles,
      files,
      dto.filesToDelete,
      diff,
    );

    // Count how many species use this characteristic
    const speciesCount = await this.specieRepository
      .createQueryBuilder('specie')
      .innerJoin(
        'specie.characteristics',
        'char',
        'char.id = :characteristicId',
        { characteristicId },
      )
      .getCount();

    return {
      status: OperationStatus.PENDING_APPROVAL,
      message: 'Update request created and awaiting approval',
      changeRequestId: cr.id,
      affectedSpeciesCount: speciesCount,
    };
  }

  /**
   * Delete a characteristic with conditional draft flow.
   * - If characteristic is used by any specie: create draft and require approval
   * - If characteristic is not used: delete directly without approval
   */
  async deleteCharacteristic(
    characteristicId: number,
    proposedById: string,
  ): Promise<CharacteristicOperationResultDto> {
    const characteristic =
      await this.characteristicRepository.findById(characteristicId);

    if (!characteristic) {
      throw new NotFoundException('characteristic not found');
    }

    const isUsedBySpecies =
      await this._isCharacteristicUsedBySpecies(characteristicId);

    if (!isUsedBySpecies) {
      // DIRECT FLOW: Characteristic is not used, delete directly
      await this.characteristicEntityRepo.softDelete(characteristicId);

      return {
        status: OperationStatus.COMPLETED,
        message: 'Characteristic deleted successfully',
        changeRequestId: null,
      };
    }

    // DRAFT FLOW: Characteristic is used by species, require approval
    // Check for existing pending delete
    const existingPendingDelete = await this.crRepo.findOne({
      where: {
        entityId: characteristicId,
        entityType: EntityType.CHARACTERISTIC,
        action: ChangeRequestAction.DELETE,
        status: ChangeRequestStatus.PENDING,
      },
    });

    if (existingPendingDelete) {
      throw new ConflictException(
        'There is already a pending delete request for this characteristic',
      );
    }

    // Create draft with current data for record
    const draft = new CharacteristicDraftEntity();
    draft.name = characteristic.name;
    const typeEntity = new CharacteristicTypeEntity();
    typeEntity.id = characteristic.type.id!;
    draft.type = typeEntity;

    const savedDraft = await this.characteristicDraftRepo.save(draft);

    // Create change request
    const proposedBy = new UserEntity();
    proposedBy.id = proposedById;

    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: EntityType.CHARACTERISTIC,
        action: ChangeRequestAction.DELETE,
        status: ChangeRequestStatus.PENDING,
        entityId: characteristicId,
        proposedBy,
        draftId: savedDraft.id,
      }),
    );

    // Count how many species use this characteristic
    const speciesCount = await this.specieRepository
      .createQueryBuilder('specie')
      .innerJoin(
        'specie.characteristics',
        'char',
        'char.id = :characteristicId',
        { characteristicId },
      )
      .getCount();

    return {
      status: OperationStatus.PENDING_APPROVAL,
      message: 'Delete request created and awaiting approval',
      changeRequestId: cr.id,
      affectedSpeciesCount: speciesCount,
    };
  }

  async approve(id: number, payload: JwtPayloadType): Promise<void> {
    const cr = await this.crRepo.findOne({ where: { id } });

    if (!cr) throw new NotFoundException('change request not found');

    const reviewer = new UserEntity();
    reviewer.id = payload.id;

    // Handle approval based on entity type
    switch (cr.entityType) {
      case EntityType.SPECIE:
        await this.approveSpecieChangeRequest(cr);
        break;

      case EntityType.CHARACTERISTIC:
        await this.approveCharacteristicChangeRequest(cr);
        break;

      default:
        throw new UnprocessableEntityException(
          `Entity type ${cr.entityType} not supported for approval`,
        );
    }

    cr.status = ChangeRequestStatus.APPROVED;
    cr.decidedAt = new Date();
    cr.reviewedBy = reviewer;

    await this.crRepo.save(cr);
  }

  private async approveSpecieChangeRequest(
    cr: ChangeRequestEntity,
  ): Promise<void> {
    if (
      cr.action === ChangeRequestAction.CREATE ||
      cr.action === ChangeRequestAction.UPDATE
    ) {
      // For CREATE and UPDATE, we need the draft
      if (!cr.draftId) {
        throw new UnprocessableEntityException(
          'Change request malformed: draftId is null',
        );
      }

      const draft = await this.specieDraftRepo.findOne({
        where: { id: cr.draftId },
        relations: ['taxons', 'characteristics', 'state', 'city'],
      });

      if (!draft) throw new NotFoundException('draft not found');

      if (cr.action === ChangeRequestAction.CREATE) {
        // create specie
        const newSpecie = new SpecieEntity();
        newSpecie.scientificName = draft.scientificName;
        newSpecie.commonName = draft.commonName ?? null;
        newSpecie.description = draft.description ?? null;
        newSpecie.collectLocation = draft.collectLocation ?? null;
        newSpecie.geoLocation = draft.geoLocation as any;
        newSpecie.state = draft.state;
        newSpecie.city = draft.city;
        newSpecie.collector = draft.collector;
        newSpecie.determinator = draft.determinator;
        newSpecie.collectedAt = draft.collectedAt;
        newSpecie.determinatedAt = draft.determinatedAt;
        newSpecie.taxons = draft.taxons ?? [];
        newSpecie.characteristics = draft.characteristics ?? [];

        const sp = this.specieRepository.create(
          await this.specieRepository.save(newSpecie),
        );

        await this.filesMinioService.moveCrFilesToSpecies(cr.id, sp.id);

        // Approve any pending characteristic files related to the draft characteristics
        const characteristicIds = (draft.characteristics ?? []).map(
          (c) => c.id,
        );
        if (characteristicIds.length) {
          await this.fileRepository.approveByCharacteristicIds(
            characteristicIds,
          );
        }

        cr.entityId = sp.id; // Set entityId after creating the entity for tracking

        await this.postService.createFromChangeRequest(
          ChangeRequestMapper.toDomain(cr),
          SpecieMapper.toDomain(sp),
        );
      } else if (cr.action === ChangeRequestAction.UPDATE) {
        // For UPDATE, entityId must be set to the specie being updated
        if (!cr.entityId) {
          throw new UnprocessableEntityException(
            'Change request malformed: entityId is null for UPDATE action',
          );
        }

        const specie = await this.specieRepository.findOne({
          where: { id: cr.entityId },
          relations: ['taxons', 'characteristics'],
        });

        if (!specie) throw new NotFoundException('specie not found');

        specie.scientificName = draft.scientificName;
        specie.commonName = draft.commonName ?? null;
        specie.description = draft.description ?? null;
        specie.collectLocation = draft.collectLocation ?? null;
        specie.geoLocation = draft.geoLocation as any;
        specie.state = draft.state;
        specie.city = draft.city;
        specie.collector = draft.collector;
        specie.determinator = draft.determinator;
        specie.collectedAt = draft.collectedAt;
        specie.determinatedAt = draft.determinatedAt;
        specie.taxons = draft.taxons ?? [];
        specie.characteristics = draft.characteristics ?? [];

        await this.specieRepository.save(specie);

        cr.entityId = specie.id; // Set entityId for tracking

        // Handle file changes from diff
        const filesDiff = (cr.diff as any)?.files as FileDiffResult | undefined;

        // Copy new files from change request to specie
        if (filesDiff?.added?.length) {
          await this.filesMinioService.copyFilesToSpecie(
            filesDiff.added.map((f) => f.path),
            specie.id,
          );
        }

        // Handle file deletions
        if (filesDiff?.removed?.length) {
          const filesToDeleteIds = filesDiff.removed.map((f) => f.id);

          const owned = await this.fileRepository.findIdsBySpecie(
            cr.entityId,
            filesToDeleteIds,
          );

          if (owned.length !== filesToDeleteIds.length) {
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                filesToDelete:
                  'one or more files do not belong to the target specie',
              },
            });
          }

          await this.filesMinioService.softDelete(filesToDeleteIds);
        }

        // TODO: check if will need this logic after implementing CR to characteristic relation
        const characteristicIds = (draft.characteristics ?? []).map(
          (c) => c.id,
        );

        if (characteristicIds.length) {
          await this.fileRepository.approveByCharacteristicIds(
            characteristicIds,
          );
        }

        await this.postService.createFromChangeRequest(
          ChangeRequestMapper.toDomain(cr),
          SpecieMapper.toDomain(specie),
        );
      }
    } else if (cr.action === ChangeRequestAction.DELETE) {
      if (!cr.entityId) {
        throw new UnprocessableEntityException(
          'Change request malformed: entityId is null',
        );
      }

      const specie = await this.specieRepository.findOne({
        where: { id: cr.entityId },
      });

      if (!specie) {
        throw new NotFoundException('specie not found');
      }

      await Promise.all([
        this.specieRepository.softDelete(specie.id),
        this.postService.invalidatePublishedPostsBySpecieId(specie.id),
      ]);
    }
  }

  private async approveCharacteristicChangeRequest(
    cr: ChangeRequestEntity,
  ): Promise<void> {
    // Note: CREATE action no longer uses draft flow, so only UPDATE and DELETE are handled here
    if (cr.action === ChangeRequestAction.UPDATE) {
      // For UPDATE, we need the draft
      if (!cr.draftId) {
        throw new UnprocessableEntityException(
          'Change request malformed: draftId is null',
        );
      }

      const draft = await this.characteristicDraftRepo.findOne({
        where: { id: cr.draftId },
        relations: ['type'],
      });

      if (!draft) throw new NotFoundException('draft not found');

      // For UPDATE, entityId must be set to the characteristic being updated
      if (!cr.entityId) {
        throw new UnprocessableEntityException(
          'Change request malformed: entityId is null for UPDATE action',
        );
      }

      const characteristic = await this.characteristicEntityRepo.findOne({
        where: { id: cr.entityId },
      });

      if (!characteristic) {
        throw new NotFoundException('characteristic not found');
      }

      // Update characteristic fields
      characteristic.name = draft.name;
      characteristic.type = draft.type;

      await this.characteristicEntityRepo.save(characteristic);

      const filesDiff = (cr.diff as any)?.files as FileDiffResult | undefined;

      // Approve new files if any exist
      if (filesDiff?.added?.length) {
        await this.fileRepository.approveByCharacteristicIds([
          characteristic.id,
        ]);
      }

      // Handle file deletion if requested
      if (filesDiff?.removed?.length) {
        await this.filesMinioService.softDelete(
          filesDiff.removed.map((f) => f.id),
        );
      }

      cr.entityId = characteristic.id; // Set entityId for tracking
    } else if (cr.action === ChangeRequestAction.DELETE) {
      if (!cr.entityId) {
        throw new UnprocessableEntityException(
          'Change request malformed: entityId is null',
        );
      }

      const characteristic = await this.characteristicEntityRepo.findOne({
        where: { id: cr.entityId },
      });

      if (!characteristic) {
        throw new NotFoundException('characteristic not found');
      }

      await this.characteristicEntityRepo.softDelete(characteristic.id);
    } else {
      throw new UnprocessableEntityException(
        `Action ${cr.action} not supported for characteristic change requests. Only UPDATE and DELETE require approval.`,
      );
    }
  }

  async reject(id: number, reviewerId: string, reviewerNote?: string) {
    const cr = await this.crRepo.findOne({ where: { id } });

    if (!cr) throw new NotFoundException('change request not found');

    const reviewer = new UserEntity();
    reviewer.id = reviewerId;
    cr.status = ChangeRequestStatus.REJECTED;
    cr.decidedAt = new Date();
    cr.reviewerNote = reviewerNote ?? null;
    cr.reviewedBy = reviewer;

    await this.crRepo.save(cr);

    // Cleanup any files uploaded for this change request
    const crFileIds = await this.fileRepository.findIdsByChangeRequest(cr.id);
    if (crFileIds.length) {
      await this.filesMinioService.softDelete(crFileIds);
    }
  }

  async listPaginatedChangeRequests({
    paginationOptions,
    status,
    action,
    entityType,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    status?: ChangeRequestStatus;
    action?: ChangeRequestAction;
    entityType?: string;
    search?: string;
  }): Promise<WithCountList<ListChangeRequestDto>> {
    const qb = this.crRepo
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.proposedBy', 'proposedBy')
      .leftJoinAndSelect('cr.reviewedBy', 'reviewedBy');

    qb.leftJoin(
      SpecieDraftEntity,
      'specieDraft',
      'specieDraft.id = cr.draftId AND cr.entityType = :specieType',
      { specieType: EntityType.SPECIE },
    ).addSelect([
      'specieDraft.id',
      'specieDraft.scientificName',
      'specieDraft.createdAt',
    ]);

    qb.leftJoinAndMapMany(
      'cr.charDraft',
      CharacteristicDraftEntity,
      'charDraft',
      'charDraft.id = cr.draftId AND cr.entityType = :charType',
      { charType: EntityType.CHARACTERISTIC },
    );

    if (entityType) {
      qb.where('cr.entityType = :entityType', { entityType });
    }

    if (status) {
      qb.andWhere('cr.status = :status', { status });
    }

    if (action) {
      qb.andWhere('cr.action = :action', { action });
    }

    if (search && search.trim().length) {
      const s = `%${search.trim()}%`;
      const searchClauses = [
        'proposedBy.firstName ILIKE :s',
        'proposedBy.lastName ILIKE :s',
        'reviewedBy.firstName ILIKE :s',
        'reviewedBy.lastName ILIKE :s',
      ];

      if (!entityType || entityType === EntityType.SPECIE) {
        searchClauses.push('specieDraft.scientificName ILIKE :s');
      }

      if (!entityType || entityType === EntityType.CHARACTERISTIC) {
        searchClauses.push('charDraft.name ILIKE :s');
      }

      qb.andWhere(`(${searchClauses.join(' OR ')})`, { s });
    }

    const total = await qb.getCount();

    const { entities, raw } = await qb
      .orderBy('cr.proposedAt', 'DESC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getRawAndEntities();

    const dto: ListChangeRequestDto[] = entities.map((cr) => {
      let entityName = 'Unknown';
      let draftCreatedAt = cr.proposedAt;

      // Extract entity name based on type
      if (cr.entityType === EntityType.SPECIE) {
        const draftData = raw.find((r) => r.specieDraft_id === cr.draftId);
        entityName = draftData?.specieDraft_scientificName ?? 'Unknown';
        draftCreatedAt = draftData?.specieDraft_createdAt ?? cr.proposedAt;
      } else if (cr.entityType === EntityType.CHARACTERISTIC) {
        const draftData = raw.find((r) => r.charDraft_id === cr.draftId);
        entityName = draftData?.charDraft_name ?? 'Unknown';
        draftCreatedAt = draftData?.charDraft_createdAt ?? cr.proposedAt;
      }
      // Add other entity types here as they are implemented
      // else if (cr.entityType === EntityType.TAXON) { ... }

      return {
        id: Number(cr.draftId),
        entityType: cr.entityType,
        entityName,
        changeRequest: {
          id: cr.id,
          status: cr.status,
          action: cr.action,
          proposedBy: UserFactory.createAuthor(
            UserMapper.toDomain(cr.proposedBy),
          ),
          reviewedBy: cr.reviewedBy
            ? UserFactory.createAuthor(UserMapper.toDomain(cr.reviewedBy))
            : null,
          reviewerNote: cr.reviewerNote,
          proposedAt: cr.proposedAt,
          decidedAt: cr.decidedAt,
        },
        createdAt: draftCreatedAt,
      };
    });

    return [dto, total];
  }

  async getSpecieDraftDetail(id: number): Promise<GetSpecieDto> {
    // id here is the draftId
    const draft = await this.specieDraftRepo.findOne({
      where: { id },
      relations: [
        'taxons',
        'taxons.hierarchy',
        'characteristics',
        'characteristics.type',
        'collector',
        'determinator',
        'city',
        'state',
      ],
    });
    if (!draft) throw new NotFoundException('draft not found');

    // Find the change request that references this draft
    const changeRequest = await this.crRepo.findOne({
      where: { draftId: id, entityType: EntityType.SPECIE },
    });

    if (!changeRequest) throw new NotFoundException('change request not found');

    // Determine which files to show:
    // For UPDATE/DELETE: show existing specie files
    // For CREATE: show files uploaded with the change request
    let files: any[] = [];
    if (changeRequest.entityId) {
      // UPDATE or DELETE - load existing specie's files
      const specie = await this.specieRepository.findOne({
        where: { id: changeRequest.entityId },
        relations: ['files'],
      });
      files = specie?.files ?? [];
    } else {
      // CREATE - load files from change request
      files = await this.fileRepository.findByChangeRequest(changeRequest.id);
    }

    const taxons = (draft.taxons ?? []).map((tx) => ({
      id: tx.id,
      name: tx.name,
      hierarchy: { id: tx.hierarchy.id, name: tx.hierarchy.name },
    }));

    const characteristics = (draft.characteristics ?? []).map((c) =>
      CharacteristicFactory.toDto(CharacteristicMapper.toDomain(c)),
    );

    if (!draft.collectLocation) {
      throw new UnprocessableEntityException('draft malformed');
    }

    const dto: GetSpecieDto = {
      id: changeRequest.entityId ?? draft.id,
      scientificName: draft.scientificName,
      commonName: draft.commonName,
      description: draft.description,
      collector: draft.collector,
      determinator: draft.determinator,
      collectedAt: draft.collectedAt,
      determinatedAt: draft.determinatedAt,
      status: changeRequest.status,
      statusReason: changeRequest.reviewerNote ?? null,
      taxons,
      characteristics,
      files,
      location: {
        address: draft.collectLocation,
        lat: draft.geoLocation.coordinates[1],
        long: draft.geoLocation.coordinates[0],
        city: CityMapper.toDomain(draft.city),
        state: StateMapper.toDomain(draft.state),
      },
    };

    return dto;
  }

  async getCharacteristicDraftDetail(
    id: number,
  ): Promise<GetCharacteristicDraftDto> {
    const draft = await this.characteristicDraftRepo.findOne({
      where: { id },
      relations: ['type'],
    });
    if (!draft) throw new NotFoundException('characteristic draft not found');

    const changeRequest = await this.crRepo.findOne({
      where: { draftId: id, entityType: EntityType.CHARACTERISTIC },
    });

    if (!changeRequest) throw new NotFoundException('change request not found');

    return {
      id: draft.id,
      name: draft.name,
      type: {
        id: draft.type.id!,
        name: draft.type.name,
        createdAt: draft.type.createdAt,
        updatedAt: draft.type.updatedAt,
      },
    };
  }

  async getDraftDetail(draftId: number, entityType: string): Promise<any> {
    // Find the change request to determine the entity type
    const changeRequest = await this.crRepo.findOne({
      where: { draftId, entityType },
    });

    if (!changeRequest) throw new NotFoundException('change request not found');

    // Route to the appropriate handler based on entity type
    switch (entityType) {
      case EntityType.SPECIE:
        return this.getSpecieDraftDetail(draftId);
      case EntityType.CHARACTERISTIC:
        return this.getCharacteristicDraftDetail(draftId);
      // Add other entity types here as they are implemented
      // case EntityType.TAXON:
      //   return this.getTaxonDraftDetail(draftId);
      default:
        throw new UnprocessableEntityException(
          `Draft details for entity type '${entityType}' not implemented yet`,
        );
    }
  }
}
