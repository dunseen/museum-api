import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { TaxonEntity } from '../../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { CityEntity } from '../../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { StateEntity } from '../../../../../states/infrastructure/persistence/relational/entities/state.entity';
import { SpecialistEntity } from '../../../../../specialists/infrastructure/persistence/relational/entities/specialist.entity';

@Entity({ name: 'specie_draft' })
export class SpecieDraftEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // NOTE: No direct relation to ChangeRequestEntity
  // The relationship is managed through change_request.draftId pointing to this entity
  // This allows the same polymorphic pattern for other draft tables

  // Null for create; points to live specie on update/delete
  @ManyToOne(() => SpecieEntity, { nullable: true })
  specie: SpecieEntity | null;

  @Column({ type: 'varchar', length: 255 })
  scientificName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  commonName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  collectLocation: string | null;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  geoLocation: Point;

  @ManyToMany(() => TaxonEntity, { cascade: true, eager: true })
  @JoinTable({ name: 'specie_draft_taxon' })
  taxons: TaxonEntity[];

  @ManyToMany(() => CharacteristicEntity, { cascade: true, eager: true })
  @JoinTable({ name: 'specie_draft_characteristic' })
  characteristics: CharacteristicEntity[];

  @ManyToOne(() => StateEntity, { eager: true })
  state: StateEntity;

  @ManyToOne(() => CityEntity, { eager: true })
  city: CityEntity;

  @ManyToOne(() => SpecialistEntity, { eager: true })
  collector: SpecialistEntity;

  @ManyToOne(() => SpecialistEntity, { eager: true })
  determinator: SpecialistEntity;

  @Column({ type: 'timestamp' })
  collectedAt: Date;

  @Column({ type: 'timestamp' })
  determinatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
