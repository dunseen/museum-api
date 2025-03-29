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
  location: NullableType<string>;

  @Column({
    type: 'decimal',
  })
  lat: number;

  @Column({
    type: 'decimal',
  })
  long: number;

  @ManyToMany(() => TaxonEntity, { eager: true })
  @JoinTable({
    name: 'specie_taxon',
  })
  taxons: TaxonEntity[];

  @ManyToMany(() => CharacteristicEntity, { eager: true })
  @JoinTable({
    name: 'specie_characteristic',
  })
  characteristics: CharacteristicEntity[];

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  collectedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
