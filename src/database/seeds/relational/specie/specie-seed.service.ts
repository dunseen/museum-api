import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecieEntity } from '../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { Repository } from 'typeorm';
import { CharacteristicEntity } from '../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CharacteristicTypeEntity } from '../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';

import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { SpecialistEntity } from '../../../../specialists/infrastructure/persistence/relational/entities/specialist.entity';
import { SpecialistType } from '../../../../specialists/domain/specialist';
import { ChangeRequestsService } from '../../../../change-requests/change-requests.service';
import { ChangeRequestStatus } from '../../../../change-requests/domain/change-request';
import { ChangeRequestEntity } from '../../../../change-requests/infrastructure/persistence/relational/entities/change-request.entity';
import { CreateSpecieDto } from 'src/species/dto/create-specie.dto';

const speciesData = [
  {
    scientificName: 'Astragalus carolinianus',
    commonName: null,
    description: 'Planta herbácea perene encontrada em pradarias.',
    characteristics: [
      { type: 'Descrição', value: 'Planta herbácea perene' },
      { type: 'Habitat', value: 'Comum em áreas de pradarias' },
      { type: 'Flor', value: 'Flores pequenas e esbranquiçadas ou rosadas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Fabales', parent: null },
      { type: 'família', value: 'Fabaceae', parent: 'Fabales' },
      { type: 'gênero', value: 'Astragalus', parent: 'Fabaceae' },
    ],
    images: './images/astragalus-carolinianus/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Luehea paniculata',
    commonName: 'Açoita-cavalo',
    description: 'Árvore com madeira usada na construção civil.',
    characteristics: [
      { type: 'Casca', value: 'Casca rugosa' },
      { type: 'Folhagem', value: 'Folhas simples' },
      { type: 'Uso', value: 'Madeira usada na construção civil' },
    ],
    taxons: [
      { type: 'ordem', value: 'Malvales', parent: null },
      {
        type: 'família',
        value: 'Malvaceae',
        parent: 'Malvales',
      },
      { type: 'gênero', value: 'Luehea', parent: 'Malvaceae' },
    ],
    images: './images/luehea-paniculataa/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Eugenia subglomerata',
    commonName: null,
    description: 'Arbusto com folhas simples e frutos comestíveis.',
    characteristics: [
      { type: 'Folhagem', value: 'Folhas simples e opostas' },
      { type: 'Fruto', value: 'Frutos comestíveis' },
      { type: 'Flor', value: 'Flores pequenas e brancas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Myrtales', parent: null },
      {
        type: 'família',
        value: 'Myrtaceae',
        parent: 'Myrtales',
      },
      { type: 'gênero', value: 'Eugenia', parent: 'Myrtaceae' },
    ],
    images: './images/eugenia-subglomerata/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Eriosema defoliatum',
    commonName: null,
    description: 'Planta herbácea encontrada no Cerrado.',
    characteristics: [
      { type: 'Habitat', value: 'Encontrada em áreas de Cerrado' },
      { type: 'Flor', value: 'Flores amarelas' },
      { type: 'Folhagem', value: 'Folhas trifolioladas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Fabales', parent: null },
      {
        type: 'família',
        value: 'Fabaceae',
        parent: 'Fabales',
      },
      { type: 'gênero', value: 'Eriosema', parent: 'Fabaceae' },
    ],
    images: './images/eriosema-defoliatum/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Hyptis recurvata',
    commonName: null,
    description: 'Planta herbácea aromática comum em regiões tropicais.',
    characteristics: [
      { type: 'Folhagem', value: 'Folhas aromáticas' },
      { type: 'Flor', value: 'Flores pequenas de cor azulada ou lilás' },
      { type: 'Habitat', value: 'Comum em regiões tropicais' },
    ],
    taxons: [
      { type: 'ordem', value: 'Lamiales', parent: null },
      {
        type: 'família',
        value: 'Lamiaceae',
        parent: 'Lamiales',
      },
      { type: 'gênero', value: 'Hyptis', parent: 'Lamiaceae' },
    ],
    images: './images/hyptis-recurvata/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Tapeinostemon longiflorum var. longiflorum',
    commonName: null,
    description:
      'Planta herbácea com flores longas encontrada em florestas úmidas.',
    characteristics: [
      { type: 'Flor', value: 'Flores longas e tubulares' },
      { type: 'Habitat', value: 'Encontrada em florestas úmidas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Gentianales', parent: null },
      {
        type: 'família',
        value: 'Apocynaceae',
        parent: 'Gentianales',
      },
      { type: 'gênero', value: 'Tapeinostemon', parent: 'Apocynaceae' },
    ],
    images: './images/tapeinostemon-longiflorum/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Parkia gigantocarpa',
    commonName: 'Faveira-de-macaco',
    description: 'Árvore de grande porte com inflorescências globulares.',
    characteristics: [
      { type: 'Folhagem', value: 'Folhas bipinadas' },
      { type: 'Inflorescência', value: 'Inflorescências em forma de globo' },
      { type: 'Fruto', value: 'Frutos grandes e lenhosos' },
    ],
    taxons: [
      { type: 'ordem', value: 'Fabales', parent: null },
      {
        type: 'família',
        value: 'Fabaceae',
        parent: 'Fabales',
      },
      { type: 'gênero', value: 'Parkia', parent: 'Fabaceae' },
    ],
    images: './images/parkia-gigantocarpa/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Doliocarpus sellowianus',
    commonName: null,
    description: 'Trepadeira lenhosa comum em florestas tropicais.',
    characteristics: [
      { type: 'Folhagem', value: 'Folhas simples e alternas' },
      { type: 'Flor', value: 'Flores brancas' },
      { type: 'Fruto', value: 'Frutos do tipo cápsula' },
    ],
    taxons: [
      { type: 'ordem', value: 'Dilleniales', parent: null },
      {
        type: 'família',
        value: 'Dilleniaceae',
        parent: 'Dilleniales',
      },
      { type: 'gênero', value: 'Doliocarpus', parent: 'Dilleniaceae' },
    ],
    images: './images/doliocarpus-sellowianus/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Crateva tapia',
    commonName: 'Trapiá',
    description: 'Árvore com flores ornamentais e frutos do tipo baga.',
    characteristics: [
      { type: 'Flor', value: 'Flores brancas a amarelas' },
      { type: 'Fruto', value: 'Frutos do tipo baga' },
      { type: 'Folhagem', value: 'Folhas trifolioladas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Brassicales', parent: null },
      {
        type: 'família',
        value: 'Capparaceae',
        parent: 'Brassicales',
      },
      { type: 'gênero', value: 'Crateva', parent: 'Capparaceae' },
    ],
    images: './images/crateva-tapia/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
  {
    scientificName: 'Byrsonima crassifolia',
    commonName: 'Murici',
    description: 'Arbusto com frutos consumidos na alimentação.',
    characteristics: [
      { type: 'Fruto', value: 'Frutos do tipo drupa' },
      { type: 'Habitat', value: 'Comum em áreas tropicais' },
      { type: 'Flor', value: 'Flores amarelas' },
    ],
    taxons: [
      { type: 'ordem', value: 'Malpighiales', parent: null },
      {
        type: 'família',
        value: 'Malpighiaceae',
        parent: 'Malpighiales',
      },
      { type: 'gênero', value: 'Byrsonima', parent: 'Malpighiaceae' },
    ],
    images: './images/byrsonima/',
    lat: -23.5505,
    long: -46.6333,
    location: 'Av. de todos',
    city: 1,
    state: 8,
    collector: 'John Doe',
    determinator: 'Jane Smith',
    determinatedAt: new Date('2023-01-01'),
    collectedAt: new Date('2023-01-01'),
  },
];

@Injectable()
export class SpecieSeedService {
  constructor(
    @InjectRepository(SpecieEntity)
    private readonly specieRepository: Repository<SpecieEntity>,
    @InjectRepository(CharacteristicEntity)
    private readonly characteristicRepository: Repository<CharacteristicEntity>,
    @InjectRepository(CharacteristicTypeEntity)
    private readonly characteristicTypeRepository: Repository<CharacteristicTypeEntity>,
    @InjectRepository(HierarchyEntity)
    private readonly hierarchyRepository: Repository<HierarchyEntity>,
    @InjectRepository(TaxonEntity)
    private readonly taxonRepository: Repository<TaxonEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SpecialistEntity)
    private readonly specialistRepository: Repository<SpecialistEntity>,
    private readonly changeRequestsService: ChangeRequestsService,
    @InjectRepository(ChangeRequestEntity)
    private readonly changeRequestRepository: Repository<ChangeRequestEntity>,
  ) {}

  async run() {
    const user = await this.userRepository.findOne({
      where: {
        email: 'admin@example.com',
      },
    });

    if (!user) {
      console.error('❌ Admin user not found, cannot seed species');
      return;
    }

    // Create or find specialists
    let determinator = await this.specialistRepository.findOne({
      where: { name: speciesData[0].determinator },
    });

    determinator ??= await this.specialistRepository.save({
      name: speciesData[0].determinator,
      type: SpecialistType.DETERMINATOR,
    });

    let collector = await this.specialistRepository.findOne({
      where: { name: speciesData[0].collector },
    });

    collector ??= await this.specialistRepository.save({
      name: speciesData[0].collector,
      type: SpecialistType.COLLECTOR,
    });

    for (const specieData of speciesData) {
      try {
        // Check if species already exists
        const existingSpecie = await this.specieRepository.findOne({
          where: { scientificName: specieData.scientificName },
        });

        if (existingSpecie) {
          console.log(
            `⚠️ Specie ${specieData.scientificName} already exists, skipping`,
          );
          continue;
        }

        // Process characteristics
        const characteristicIds: number[] = [];
        for (const characteristic of specieData.characteristics) {
          let characteristicType =
            await this.characteristicTypeRepository.findOne({
              where: { name: characteristic.type.toLowerCase() },
            });

          if (!characteristicType) {
            characteristicType = await this.characteristicTypeRepository.save({
              name: characteristic.type.toLowerCase(),
            });
          }

          let characteristicEntity =
            await this.characteristicRepository.findOne({
              where: { name: characteristic.value, type: characteristicType },
            });

          if (!characteristicEntity) {
            characteristicEntity = await this.characteristicRepository.save({
              name: characteristic.value.toLowerCase(),
              type: characteristicType,
              description: 'default',
            });
          }

          characteristicIds.push(characteristicEntity.id);
        }

        // Process taxons
        const taxonIds: number[] = [];
        for (const taxon of specieData.taxons) {
          let hierarchy = await this.hierarchyRepository.findOne({
            where: { name: taxon.type.toLowerCase() },
          });

          if (!hierarchy) {
            hierarchy = await this.hierarchyRepository.save({
              name: taxon.type.toLowerCase(),
            });
          }

          let taxonEntity = await this.taxonRepository.findOne({
            where: { name: taxon.value.toLowerCase(), hierarchy: hierarchy },
          });

          if (!taxonEntity) {
            const newTaxon = this.taxonRepository.create({
              name: taxon.value.toLowerCase(),
              hierarchy: {
                id: hierarchy.id,
              },
            });

            if (taxon.parent) {
              const parentTaxon = await this.taxonRepository.findOne({
                where: { name: taxon.parent.toLowerCase() },
              });

              if (parentTaxon) {
                newTaxon.parent = parentTaxon;
              }
            }

            taxonEntity = await this.taxonRepository.save(newTaxon);
          }

          taxonIds.push(taxonEntity.id);
        }

        // Create the creation request DTO with appropriate types for the change request service
        const createSpecieDto: CreateSpecieDto = {
          scientificName: specieData.scientificName,
          commonName: specieData.commonName,
          description: specieData.description,
          collectorId: collector.id,
          determinatorId: determinator.id,
          collectedAt: specieData.collectedAt,
          determinatedAt: specieData.determinatedAt,
          location: {
            address: specieData.location,
            lat: specieData.lat,
            long: specieData.long,
            cityId: specieData.city,
            stateId: specieData.state,
          },
          characteristicIds,
          taxonIds,
          file: [],
        };

        // Prepare the files for upload if they exist
        const filesToUpload: Express.Multer.File[] = [];
        if (specieData.images) {
          const imageDir = path.resolve(__dirname, specieData.images);
          if (fs.existsSync(imageDir)) {
            const files = fs.readdirSync(imageDir);
            for (const file of files) {
              const filePath = path.join(imageDir, file);
              if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const mimetype =
                  file.endsWith('.jpg') || file.endsWith('.jpeg')
                    ? 'image/jpeg'
                    : file.endsWith('.png')
                      ? 'image/png'
                      : file.endsWith('.gif')
                        ? 'image/gif'
                        : 'application/octet-stream';

                // Create a file object with required properties for the Multer interface
                // We need to cast to any here because the Express.Multer.File expects a Readable stream
                // but we have a buffer from the file
                filesToUpload.push({
                  buffer: fileBuffer,
                  originalname: file,
                  mimetype,
                  fieldname: 'file',
                  encoding: '7bit',
                  size: fileBuffer.length,
                  destination: '',
                  filename: '',
                  path: '',
                } as any);
              }
            }
          }
        }

        // Create change request for species creation
        await this.changeRequestsService.proposeSpecieCreate(
          createSpecieDto,
          filesToUpload,
          user.id,
        );

        // Find the last created change request for this species
        const changeRequest = await this.changeRequestRepository.findOne({
          where: {
            entityType: 'specie',
            proposedBy: { id: user.id },
            status: ChangeRequestStatus.PENDING,
          },
          order: { proposedAt: 'DESC' },
        });

        if (!changeRequest) {
          console.log(
            `❌ Failed to find change request for ${specieData.scientificName}`,
          );
          continue;
        }

        // Automatically approve the change request - files are already uploaded as part of the proposeSpecieCreate
        // Simulate JWT payload for approval - these values are required by the change-requests service
        await this.changeRequestsService.approve(changeRequest.id, {
          id: user.id,
          role: { id: 1, name: 'admin' },
          sessionId: 'seed-session',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        });

        console.log(
          `✅ Created and approved species: ${specieData.scientificName}`,
        );
      } catch (error) {
        console.error(
          `❌ Error processing species ${specieData.scientificName}:`,
          error,
        );
      }
    }
  }
}
