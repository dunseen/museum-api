import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';
import { TaxonEntity } from '../../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';

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
  })
  commonName: string;

  @Index()
  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  description: NullableType<string>;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
