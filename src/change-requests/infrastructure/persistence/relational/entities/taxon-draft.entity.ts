import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { HierarchyEntity } from '../../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { TaxonEntity } from '../../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { CharacteristicEntity } from '../../../../../characteristics/infrastructure/persistence/relational/entities/characteristic.entity';

@Entity({ name: 'taxon_draft' })
export class TaxonDraftEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => HierarchyEntity, { eager: true })
  @JoinColumn({ name: 'hierarchy_id' })
  hierarchy: HierarchyEntity;

  @ManyToOne(() => TaxonEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TaxonEntity | null;

  @ManyToMany(() => CharacteristicEntity, { cascade: true, eager: true })
  @JoinTable({ name: 'taxon_draft_characteristic' })
  characteristics: CharacteristicEntity[];
}
