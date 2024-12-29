import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'hierarchy',
})
export class HierarchyEntity extends EntityRelationalHelper {
  @PrimaryColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
