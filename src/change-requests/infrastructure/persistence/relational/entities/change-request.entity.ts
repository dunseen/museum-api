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
  entityType: string; // e.g., 'specie', 'characteristic', 'taxon'

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

  // EntityId: Stores the ID of the entity being modified/deleted
  // For CREATE: null initially, set on approval
  // For UPDATE/DELETE: set to the existing entity ID
  @Index()
  @Column({ type: 'int', nullable: true })
  entityId: number | null;

  // Polymorphic reference to draft table (determined by entityType)
  // For 'specie' -> references specie_draft.id
  // For 'characteristic' -> references characteristic_draft.id (future)
  // For 'taxon' -> references taxon_draft.id (future)
  // Used for all actions (CREATE, UPDATE, DELETE) to keep a snapshot
  @Index()
  @Column({ type: 'int', nullable: true })
  draftId: number | null;

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
