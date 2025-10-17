import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import {
  ChangeRequestAction,
  ChangeRequestStatus,
} from '../../../../domain/change-request';

@Entity({ name: 'change_request' })
export class ChangeRequestEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  entityType: string; // e.g., 'specie'

  @Column({
    type: 'enum',
    enum: ChangeRequestAction,
    enumName: 'change_request_action_enum',
  })
  action: ChangeRequestAction;

  @Column({
    type: 'enum',
    enum: ChangeRequestStatus,
    enumName: 'change_request_status_enum',
    default: ChangeRequestStatus.PENDING,
  })
  status: ChangeRequestStatus;

  @Index()
  @Column({ type: 'int', nullable: true })
  entityId: number | null;

  @ManyToOne(() => UserEntity, { eager: true })
  proposedBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  reviewedBy: UserEntity | null;

  @CreateDateColumn()
  proposedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  decidedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'text', nullable: true })
  reviewerNote: string | null;

  @Column({ type: 'jsonb', nullable: true })
  diff: unknown | null;
}
