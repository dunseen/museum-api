import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { HierarchyEntity } from '../../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';

@Entity({
  name: 'taxon',
})
export class TaxonEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @ManyToOne(() => HierarchyEntity, { eager: true })
  hierarchy: HierarchyEntity;

  @ManyToOne(() => TaxonEntity, { nullable: true })
  parent: TaxonEntity | null;

  @ManyToMany(() => CharacteristicEntity)
  @JoinTable({
    name: 'taxon_characteristic',
  })
  characteristics: CharacteristicEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
