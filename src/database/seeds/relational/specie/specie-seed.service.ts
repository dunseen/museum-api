import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecieEntity } from '../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { Repository } from 'typeorm';
import { CharacteristicEntity } from '../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CharacteristicTypeEntity } from '../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';

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
      { type: 'família', value: 'Fabaceae' },
      { type: 'gênero', value: 'Astragalus' },
    ],
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
      { type: 'família', value: 'Malvaceae' },
      { type: 'gênero', value: 'Luehea' },
    ],
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
      { type: 'família', value: 'Myrtaceae' },
      { type: 'gênero', value: 'Eugenia' },
    ],
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
      { type: 'família', value: 'Fabaceae' },
      { type: 'gênero', value: 'Eriosema' },
    ],
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
      { type: 'família', value: 'Lamiaceae' },
      { type: 'gênero', value: 'Hyptis' },
    ],
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
      { type: 'família', value: 'Apocynaceae' },
      { type: 'gênero', value: 'Tapeinostemon' },
    ],
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
      { type: 'família', value: 'Fabaceae' },
      { type: 'gênero', value: 'Parkia' },
    ],
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
      { type: 'família', value: 'Dilleniaceae' },
      { type: 'gênero', value: 'Doliocarpus' },
    ],
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
      { type: 'família', value: 'Capparaceae' },
      { type: 'gênero', value: 'Crateva' },
    ],
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
      { type: 'família', value: 'Malpighiaceae' },
      { type: 'gênero', value: 'Byrsonima' },
    ],
  },
];

@Injectable()
export class SpecieSeedService {
  constructor(
    @InjectRepository(SpecieEntity)
    private specieRepository: Repository<SpecieEntity>,
    @InjectRepository(CharacteristicEntity)
    private characteristicRepository: Repository<CharacteristicEntity>,
    @InjectRepository(CharacteristicTypeEntity)
    private characteristicTypeRepository: Repository<CharacteristicTypeEntity>,
    @InjectRepository(HierarchyEntity)
    private hierarchyRepository: Repository<HierarchyEntity>,
    @InjectRepository(TaxonEntity)
    private taxonRepository: Repository<TaxonEntity>,
  ) {}

  async run() {
    for (const specieData of speciesData) {
      // Verificar e inserir tipos de características
      const characteristics: CharacteristicEntity[] = [];

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

        let characteristicEntity = await this.characteristicRepository.findOne({
          where: { name: characteristic.value, type: characteristicType },
        });

        if (!characteristicEntity) {
          characteristicEntity = await this.characteristicRepository.save({
            name: characteristic.value.toLowerCase(),
            type: characteristicType,
            description: 'default',
          });
        }

        characteristics.push(characteristicEntity);
      }

      // Verificar e inserir hierarquia e taxons
      const taxons: TaxonEntity[] = [];
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
          taxonEntity = await this.taxonRepository.save({
            name: taxon.value.toLowerCase(),
            hierarchy: {
              id: hierarchy.id,
            },
          });
        }

        taxons.push(taxonEntity);
      }

      // Verificar e inserir espécie
      let specie = await this.specieRepository.findOne({
        where: { scientificName: specieData.scientificName },
      });

      if (!specie) {
        specie = await this.specieRepository.save({
          scientificName: specieData.scientificName,
          commonName: specieData.commonName,
          description: specieData.description,
          characteristics,
          taxons,
        });
      }
    }
  }
}
