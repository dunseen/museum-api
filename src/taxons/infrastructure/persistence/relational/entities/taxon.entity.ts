import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { HierarchyEntity } from '../../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';

@Entity({
  name: 'taxon',
})
export class TaxonEntity extends EntityRelationalHelper {
  @PrimaryColumn()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
