import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { TaxonEntity } from '../../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { CityEntity } from '../../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import { StateEntity } from '../../../../../states/infrastructure/persistence/relational/entities/state.entity';
import { PostEntity } from '../../../../../posts/infrastructure/persistence/relational/entities/post.entity';
import { SpecialistEntity } from '../../../../../specialists/infrastructure/persistence/relational/entities/specialist.entity';

@Entity({
  name: 'specie',
})
export class SpecieEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  scientificName: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  commonName: NullableType<string>;

  @Index()
  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  description: NullableType<string>;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  collectLocation: NullableType<string>;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geoLocation: Point;

  @ManyToMany(() => TaxonEntity, { eager: true })
  @JoinTable({
    name: 'specie_taxon',
  })
  taxons: TaxonEntity[];

  @ManyToMany(() => CharacteristicEntity, { eager: true, cascade: true })
  @JoinTable({
    name: 'specie_characteristic',
  })
  characteristics: CharacteristicEntity[];

  @ManyToMany(() => PostEntity, (post) => post.species)
  posts: PostEntity[];

  @OneToMany(() => FileEntity, (file) => file.specie, {
    cascade: true,
    eager: true,
  })
  files: FileEntity[];

  @ManyToOne(() => StateEntity, {
    cascade: true,
    eager: true,
  })
  state: StateEntity;

  @ManyToOne(() => CityEntity, {
    cascade: true,
    eager: true,
  })
  city: CityEntity;

  @ManyToOne(() => SpecialistEntity, {
    cascade: true,
    eager: true,
  })
  collector: SpecialistEntity;

  @ManyToOne(() => SpecialistEntity, {
    cascade: true,
    eager: true,
  })
  determinator: SpecialistEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  collectedAt: Date;

  @Column({
    type: 'timestamp',
  })
  determinatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
