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
} from './domain/change-request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecieDraftEntity } from './infrastructure/persistence/relational/entities/specie-draft.entity';
import { ChangeRequestEntity } from './infrastructure/persistence/relational/entities/change-request.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { CreateSpecieDto } from '../species/dto/create-specie.dto';
import { UpdateSpecieDto } from '../species/dto/update-specie.dto';
import { SpecieEntity } from '../species/infrastructure/persistence/relational/entities/specie.entity';
import { TaxonEntity } from '../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { CharacteristicEntity } from '../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CityEntity } from '../cities/infrastructure/persistence/relational/entities/city.entity';
import { StateEntity } from '../states/infrastructure/persistence/relational/entities/state.entity';
import { SpecialistEntity } from '../specialists/infrastructure/persistence/relational/entities/specialist.entity';
import {
  IPaginationOptions,
  WithCountList,
} from '../utils/types/pagination-options';
import { FilesMinioService } from '../files/infrastructure/uploader/minio/files.service';
import { SpecieDraftWithChangeReqDto } from './dto/specie-draft-with-cr.dto';
import { FileRepository } from '../files/infrastructure/persistence/file.repository';
import { PostService } from '../posts/domain/post.service';
import { SpecieMapper } from '../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { TaxonRepository } from '../taxons/infrastructure/persistence/taxon.repository';
import { CharacteristicRepository } from '../characteristics/domain/characteristic.repository';
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

@Injectable()
export class ChangeRequestsService {
  constructor(
    @InjectRepository(SpecieDraftEntity)
    private readonly specieDraftRepo: Repository<SpecieDraftEntity>,
    @InjectRepository(ChangeRequestEntity)
    private readonly crRepo: Repository<ChangeRequestEntity>,
    private readonly taxonRepository: TaxonRepository,
    private readonly characteristicRepository: CharacteristicRepository,
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
    private readonly specialistRepository: SpecialistRepository,
    private readonly fileRepository: FileRepository,
    @InjectRepository(SpecieEntity)
    private readonly specieRepository: Repository<SpecieEntity>,
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
        entityType: 'specie',
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
        entityType: 'specie',
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
      coordinates: [dto.location.long, dto.location.lat],
    };
    draft.collectedAt = dto.collectedAt;
    draft.determinatedAt = dto.determinatedAt;

    // Step 1: Save the draft first to get its ID
    const savedDraft = await this.specieDraftRepo.save(draft);

    // Step 2: Create CR with reference to the draft
    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: 'specie',
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
    });

    if (!specie) throw new NotFoundException('specie not found');

    // Validations mirroring SpeciesService.update for provided fields
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
    }

    if (dto?.location?.cityId) {
      const city = await this.cityRepository.findById(dto.location.cityId);
      if (!city) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { cityId: 'city not found' },
        });
      }
    }

    if (dto?.location?.stateId) {
      const state = await this.stateRepository.findById(dto.location.stateId);
      if (!state) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { stateId: 'state not found' },
        });
      }
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
    }

    // Seed draft from current specie, then override with dto
    const draft = new SpecieDraftEntity();
    draft.scientificName = dto.scientificName ?? specie.scientificName;
    draft.commonName = dto.commonName ?? specie.commonName ?? null;
    draft.description = dto.description ?? specie.description ?? null;
    draft.collectLocation =
      dto.location?.address ?? specie.collectLocation ?? null;
    const lat = dto.location?.lat ?? specie.geoLocation.coordinates[1];
    const long = dto.location?.long ?? specie.geoLocation.coordinates[0];
    draft.geoLocation = {
      type: 'Point',
      coordinates: [long, lat],
    };

    const stateId = dto.location?.stateId ?? specie.state?.id;

    if (stateId) {
      const state = new StateEntity();
      state.id = stateId;
      draft.state = state;
    }

    const cityId = dto.location?.cityId ?? specie.city?.id;

    if (cityId) {
      const city = new CityEntity();
      city.id = cityId;
      draft.city = city;
    }

    const collectorId = dto.collectorId ?? specie.collector?.id;
    if (collectorId) {
      const collector = new SpecialistEntity();
      collector.id = collectorId;
      draft.collector = collector;
    }

    const determinatorId = dto.determinatorId ?? specie.determinator?.id;
    if (determinatorId) {
      const determinator = new SpecialistEntity();
      determinator.id = determinatorId;
      draft.determinator = determinator;
    }

    draft.collectedAt = dto.collectedAt ?? specie.collectedAt;
    draft.determinatedAt = dto.determinatedAt ?? specie.determinatedAt;

    draft.taxons = (dto.taxonIds ?? specie.taxons?.map((t) => t.id) ?? []).map(
      (id) => {
        const t = new TaxonEntity();
        t.id = id;
        return t;
      },
    );

    draft.characteristics = (
      dto.characteristicIds ??
      specie.characteristics?.map((c) => Number(c.id)) ??
      []
    ).map((id) => {
      const c = new CharacteristicEntity();
      c.id = Number(id);
      return c;
    });

    // Step 1: Save draft first
    const savedDraft = await this.specieDraftRepo.save(
      this.specieDraftRepo.create(draft),
    );

    // Step 2: Create CR with reference to draft
    const cr = await this.crRepo.save(
      this.crRepo.create({
        entityType: 'specie',
        action: ChangeRequestAction.UPDATE,
        status: ChangeRequestStatus.PENDING,
        entityId: specieId, // Points to the specie being updated
        proposedBy,
        draftId: savedDraft.id, // Polymorphic reference
        diff: dto.filesToDelete?.length
          ? { filesToDelete: dto.filesToDelete }
          : null,
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

  async approve(id: number, payload: JwtPayloadType): Promise<void> {
    const cr = await this.crRepo.findOne({ where: { id } });

    if (!cr) throw new NotFoundException('change request not found');

    const reviewer = new UserEntity();
    reviewer.id = payload.id;

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

        // Move CR files to specie path and approve
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
        await this.filesMinioService.moveCrFilesToSpecies(cr.id, specie.id);

        const characteristicIds = (draft.characteristics ?? []).map(
          (c) => c.id,
        );
        await this.fileRepository.approveByCharacteristicIds(characteristicIds);

        cr.entityId = specie.id; // Set entityId for tracking

        await this.postService.createFromChangeRequest(
          ChangeRequestMapper.toDomain(cr),
          SpecieMapper.toDomain(specie),
        );
      }

      // Handle files deletion if requested via diff
      const filesToDelete = (cr.diff as any)?.filesToDelete as
        | string[]
        | undefined;

      if (filesToDelete?.length) {
        if (cr.action === ChangeRequestAction.UPDATE && cr.entityId) {
          // Safety: ensure all file IDs belong to this specie before deleting
          const owned = await this.fileRepository.findIdsBySpecie(
            cr.entityId,
            filesToDelete,
          );

          if (owned.length !== filesToDelete.length) {
            throw new BadRequestException({
              status: HttpStatus.BAD_REQUEST,
              errors: {
                filesToDelete:
                  'one or more files do not belong to the target specie',
              },
            });
          }
        }

        await this.filesMinioService.delete(filesToDelete);
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

    cr.status = ChangeRequestStatus.APPROVED;
    cr.decidedAt = new Date();
    cr.reviewedBy = reviewer;

    await this.crRepo.save(cr);
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
      await this.filesMinioService.delete(crFileIds);
    }
  }

  async listSpecieDraftsWithPagination({
    paginationOptions,
    status,
    action,
    search,
  }: {
    paginationOptions: IPaginationOptions;
    status?: ChangeRequestStatus;
    action?: ChangeRequestAction;
    search?: string;
  }): Promise<WithCountList<SpecieDraftWithChangeReqDto>> {
    const qb = this.crRepo
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.proposedBy', 'proposedBy')
      .leftJoinAndSelect('cr.reviewedBy', 'reviewedBy')
      .leftJoin(
        SpecieDraftEntity,
        'draft',
        'draft.id = cr.draftId AND cr.entityType = :entityType',
        { entityType: 'specie' },
      )
      .addSelect(['draft.id', 'draft.scientificName', 'draft.createdAt'])
      .where('cr.entityType = :entityType', { entityType: 'specie' });

    if (status) {
      qb.andWhere('cr.status = :status', { status });
    }

    if (action) {
      qb.andWhere('cr.action = :action', { action });
    }

    if (search && search.trim().length) {
      const s = `%${search.trim()}%`;
      const searchClause = [
        'draft.scientificName ILIKE :s',
        'proposedBy.firstName ILIKE :s',
        'proposedBy.lastName ILIKE :s',
        'reviewedBy.firstName ILIKE :s',
        'reviewedBy.lastName ILIKE :s',
      ].join(' OR ');

      qb.andWhere(`(${searchClause})`, { s });
    }

    const total = await qb.getCount();

    const { entities, raw } = await qb
      .orderBy('cr.proposedAt', 'DESC')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getRawAndEntities();

    const draftMap = new Map(
      raw.map((d) => [
        d.draft_id,
        {
          id: d.draft_id,
          scientificName: d.draft_scientificName,
          createdAt: d.draft_createdAt,
        },
      ]),
    );

    const dto: SpecieDraftWithChangeReqDto[] = entities.map((cr) => {
      const draft = draftMap.get(cr.draftId);

      return {
        id: Number(cr.draftId),
        scientificName: draft?.scientificName,
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
        },
        createdAt: draft?.createdAt ?? cr.proposedAt,
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
      where: { draftId: id, entityType: 'specie' },
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
}
