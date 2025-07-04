import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  changedBy: UserEntity;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  approvedBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
