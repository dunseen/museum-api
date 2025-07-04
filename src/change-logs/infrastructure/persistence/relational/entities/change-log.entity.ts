import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'change_log' })
export class ChangeLogEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableName: string;

  @Column()
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  newValue: Record<string, unknown> | null;

  @Column({ nullable: true })
  changedBy: string;

  @Column({ nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
