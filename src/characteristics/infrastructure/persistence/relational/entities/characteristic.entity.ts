import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CharacteristicTypeEntity } from '../../../../../characteristic-types/infrastructure/persistence/relational/entities/characteristic-type.entity';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

@Entity({
  name: 'characteristic',
})
export class CharacteristicEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @ManyToOne(() => CharacteristicTypeEntity, { eager: true })
  type: CharacteristicTypeEntity;

  @ManyToMany(() => SpecieEntity, (specie) => specie.characteristics)
  species: SpecieEntity[];

  @OneToMany(() => FileEntity, (file) => file.characteristic, { cascade: true })
  files: FileEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
