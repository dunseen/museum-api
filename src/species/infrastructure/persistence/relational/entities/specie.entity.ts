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

  @ManyToMany(() => TaxonEntity)
  @JoinTable({
    name: 'specie_taxon',
  })
  taxons: TaxonEntity[];

  @ManyToMany(() => CharacteristicEntity)
  @JoinTable({
    name: 'specie_characteristic',
  })
  characteristics: CharacteristicEntity[];

  @OneToMany(() => FileEntity, (file) => file.specie, { cascade: true })
  files: FileEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
